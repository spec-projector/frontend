import { Component, ElementRef, ViewChild } from '@angular/core';
import { UI } from '@junte/ui';
import 'reflect-metadata';
import { BackendError } from '../../types/gql-errors';
import { FormBuilder, Validators } from '@angular/forms';
import { UserRegister } from '../../model/user';
import { RegisterGQL } from './register.graphql';
import { finalize, map } from 'rxjs/operators';
import { catchGQLErrors } from '../../utils/gql-errors';
import { deserialize, serialize } from 'serialize-ts';
import { Authorization } from '../../model/authorization';
import { Router } from '@angular/router';
import { AppConfig } from '../app-config';
import { Distance, moveDownKeyframes, moveKeyframes } from '../lp/animation';
import { animate, animateChild, group, query, state, style, transition, trigger } from '@angular/animations';

enum View {
  register = 'register',
  success = 'success'
}

@Component({
  selector: 'spec-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  animations: [
    trigger('move', [
      state('*', style({transform: 'translate3D({{distance}})'}), {params: {distance: '0,0,0'}}),
      transition('void => *', moveKeyframes, {params: {distance: '0,0,0'}}),
      transition('* => void', moveDownKeyframes, {params: {distance: '0,0,0'}})
    ]),
    trigger('changeView', [
      state('register', style({height: '455px'})),
      state('success', style({height: '*'})),
      transition('register => success', group([
        animate('.5s ease'),
        query('@fadeOut', animateChild(), {optional: true}),
        query('@fadeIn', animateChild(), {optional: true})
      ]))
    ]),
    trigger('fadeIn', [
      state('void', style({opacity: 0})),
      state('*', style({opacity: 1})),
      transition('void => *', animate('.5s ease'))
    ]),
    trigger('fadeOut', [
      state('void', style({opacity: 0})),
      state('*', style({opacity: 1})),
      transition('* => void', animate('.5s ease'))
    ])
  ]
})
export class RegisterComponent {

  ui = UI;
  errors: BackendError[] = [];
  progress = {register: false};
  distance = Distance;
  views = View;
  view: View = View.register;

  @ViewChild('content', {read: ElementRef})
  backdrop: ElementRef<HTMLElement>;

  form = this.fb.group({
    name: [null, [Validators.required]],
    email: [null, [Validators.required, Validators.email]],
    login: [null, [Validators.required]],
    password: [null, [Validators.required]]
  });

  constructor(private fb: FormBuilder,
              private registerGQL: RegisterGQL,
              private config: AppConfig,
              public router: Router) {
  }

  register() {
    const request = new UserRegister(this.form.getRawValue());
    this.progress.register = true;
    this.registerGQL.mutate({input: serialize(request)})
      .pipe(finalize(() => this.progress.register = false),
        catchGQLErrors(),
        map(({data: {register: {token}}}) =>
          deserialize(token, Authorization))
      ).subscribe((token: Authorization) => this.logged(token),
      errors => this.errors = errors);
  }

  private logged(authorization: Authorization) {
    this.config.authorization = authorization;
    this.view = View.success;
  }
}
