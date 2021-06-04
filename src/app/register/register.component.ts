import { state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormComponent, InputComponent, UI } from '@junte/ui';
import { finalize, map } from 'rxjs/operators';
import { deserialize, serialize } from 'serialize-ts';
import { UI_DELAY } from '../../consts';
import { SocialLoginSystem } from '../../enums/signin';
import { AuthToken } from '../../models/auth-token';
import { Tariff } from '../../models/tariff';
import { BackendError } from '../../types/gql-errors';
import { catchGQLErrors } from '../../utils/gql-errors';
import { AppConfig } from '../app-config';
import { MakeSocialLogin, TrySocialLogin } from '../login/models';
import { Distance, moveDownKeyframes, moveKeyframes } from '../lp/animation';
import { UserRegisterInput } from './models';
import { RegisterGQL, SocialLoginGQL } from './graphql';

@Component({
  selector: 'spec-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  animations: [
    trigger('move', [
      state('*', style({transform: 'translate3D({{distance}})'}), {params: {distance: '0,0,0'}}),
      transition('void => *', moveKeyframes, {params: {distance: '0,0,0', duration: '.5s'}}),
      transition('* => void', moveDownKeyframes, {params: {distance: '0,0,0'}})
    ])
  ]
})
export class RegisterComponent implements OnInit, AfterViewInit {

  ui = UI;
  distance = Distance;
  loginSystem = SocialLoginSystem;

  errors: BackendError[] = [];
  progress = {
    registering: false,
    redirecting: false
  };

  tariff: Tariff;

  @ViewChild('formRef')
  formRef: FormComponent;

  @ViewChild('nameRef')
  nameRef: InputComponent;

  @ViewChild('blockRef', {read: ElementRef})
  backdrop: ElementRef<HTMLElement>;

  form = this.fb.group({
    firstName: [null, [Validators.required]],
    lastName: [null, [Validators.required]],
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required]]
  });

  constructor(private registerGQL: RegisterGQL,
              private socialLoginGQL: SocialLoginGQL,
              private fb: FormBuilder,
              public config: AppConfig,
              private route: ActivatedRoute,
              public router: Router) {
  }

  ngOnInit() {
    this.route.data.subscribe(({tariff}) => this.tariff = tariff);
  }

  ngAfterViewInit() {
    setTimeout(() => this.nameRef.focus(), 100);
  }

  submit() {
    this.formRef.submit();
  }

  register() {
    const request = new UserRegisterInput(this.form.getRawValue());
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

  socialRegister(system: SocialLoginSystem) {
    const request = new TrySocialLogin({system});
    this.progress.registering = true;
    this.socialLoginGQL.mutate(serialize(request))
      .pipe(finalize(() => this.progress.registering = false),
        catchGQLErrors(),
        map(({data: {response}}) => deserialize(response, MakeSocialLogin)))
      .subscribe(({redirectUrl}) => {
          this.progress.redirecting = true;
          document.location.href = redirectUrl;
        },
        errors => this.errors = errors);
  }

  private redirect() {
    this.progress.redirecting = true;
    setTimeout(() => this.router.navigate(!!this.tariff ? ['/subscription', {tariff: this.tariff.id}] : ['/projects'])
      .then(() => this.progress.redirecting = false), UI_DELAY);
  }

}
