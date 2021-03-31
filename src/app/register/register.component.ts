import { state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormComponent, InputComponent, UI } from '@junte/ui';
import { finalize, map } from 'rxjs/operators';
import { deserialize, serialize } from 'serialize-ts';
import { UI_DELAY } from '../../consts';
import { AuthToken } from '../../model/auth-token';
import { BackendError } from '../../types/gql-errors';
import { catchGQLErrors } from '../../utils/gql-errors';
import { AppConfig } from '../app-config';
import { Distance, moveDownKeyframes, moveKeyframes } from '../lp/animation';
import { UserRegister } from './models';
import { RegisterGQL } from './register.graphql';

@Component({
  selector: 'spec-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  animations: [
    trigger('move', [
      state('*', style({transform: 'translate3D({{distance}})'}), {params: {distance: '0,0,0'}}),
      transition('void => *', moveKeyframes, {params: {distance: '0,0,0'}}),
      transition('* => void', moveDownKeyframes, {params: {distance: '0,0,0'}})
    ])
  ]
})
export class RegisterComponent implements AfterViewInit {

  ui = UI;
  distance = Distance;

  errors: BackendError[] = [];
  progress = {
    registering: false,
    redirecting: false
  };

  @ViewChild('formRef')
  formRef: FormComponent;

  @ViewChild('nameRef')
  nameRef: InputComponent;

  @ViewChild('blockRef', {read: ElementRef})
  backdrop: ElementRef<HTMLElement>;

  form = this.fb.group({
    name: [null, [Validators.required]],
    email: [null, [Validators.required, Validators.email]],
    login: [null, [Validators.required]],
    password: [null, [Validators.required]]
  });

  constructor(private registerGQL: RegisterGQL,
              private fb: FormBuilder,
              public config: AppConfig,
              public router: Router) {
  }

  ngAfterViewInit() {
    setTimeout(() => this.nameRef.focus(), 100);
  }

  submit() {
    this.formRef.submit();
  }

  register() {
    const request = new UserRegister(this.form.getRawValue());
    this.progress.registering = true;
    this.registerGQL.mutate({input: serialize(request)})
      .pipe(finalize(() => this.progress.registering = false),
        catchGQLErrors(),
        map(({data: {register: {token}}}) =>
          deserialize(token, AuthToken)))
      .subscribe((token: AuthToken) => {
        this.config.token = token;
        this.redirect();
      }, errors => this.errors = errors);
  }

  private redirect() {
    this.progress.redirecting = true;
    setTimeout(() => this.router.navigate(['/projects'])
      .then(() => this.progress.redirecting = false), UI_DELAY);
  }

}
