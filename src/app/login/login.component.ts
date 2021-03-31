import * as animations from '@angular/animations';
import { style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormComponent, InputComponent, UI } from '@junte/ui';
import 'reflect-metadata';
import { finalize, map } from 'rxjs/operators';
import { deserialize, serialize } from 'serialize-ts';
import { AppConfig } from 'src/app/app-config';
import { LoginGQL, SocialLoginCompleteGQL, SocialLoginGQL } from 'src/app/login/login.graphql';
import { AuthToken } from 'src/model/auth-token';
import { SocialLoginSystem } from '../../enums/signin';
import { BackendError } from '../../types/gql-errors';
import { catchGQLErrors } from '../../utils/gql-errors';
import { Distance, moveKeyframes } from '../lp/animation';
import { CompleteSocialLogin, MakeSocialLogin, TrySocialLogin, UserCredentials } from './models';

@Component({
  selector: 'spec-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('move', [
      animations.state('*', style({transform: 'translate3D({{distance}})'}), {params: {distance: '0,0,0'}}),
      transition('void => *', moveKeyframes, {params: {distance: '0,0,0'}})
    ])
  ]
})
export class LoginComponent implements OnInit, AfterViewInit {

  ui = UI;
  distance = Distance;
  systemBackend = SocialLoginSystem;

  progress = {login: false, redirecting: false};
  errors: BackendError[] = [];

  form = this.builder.group({
    login: [null, [Validators.required]],
    password: [null, [Validators.required]]
  });

  @ViewChild(FormComponent)
  formComponent: FormComponent;

  @ViewChild('loginRef')
  loginRef: InputComponent;

  @ViewChild('content', {read: ElementRef})
  backdrop: ElementRef<HTMLElement>;

  constructor(private loginGQL: LoginGQL,
              private socialLoginGQL: SocialLoginGQL,
              private socialLoginCompleteGQL: SocialLoginCompleteGQL,
              private config: AppConfig,
              private builder: FormBuilder,
              private route: ActivatedRoute,
              public router: Router) {
  }

  ngOnInit() {
    this.completeSocialLogin();
  }

  ngAfterViewInit() {
    setTimeout(() => this.loginRef.focus(), 100);
  }

  private completeSocialLogin() {
    const snapshot = this.route.snapshot;
    const {system} = snapshot.data;
    if (!system) {
      return;
    }

    const {code, state} = snapshot.queryParams;
    const request = new CompleteSocialLogin({system, code, state});
    this.progress.login = true;
    this.socialLoginCompleteGQL.mutate(serialize(request))
      .pipe(finalize(() => this.progress.login = false),
        map(({data: {response: {token}}}) => deserialize(token, AuthToken)))
      .subscribe((token: AuthToken) => this.logged(token),
        errors => this.errors = errors);
  }

  submit() {
    this.formComponent.submit();
  }

  login() {
    const request = new UserCredentials(this.form.getRawValue());
    this.progress.login = true;
    this.loginGQL.mutate(request)
      .pipe(finalize(() => this.progress.login = false),
        catchGQLErrors(),
        map(({data: {response: {token}}}) =>
          deserialize(token, AuthToken)))
      .subscribe((token: AuthToken) => this.logged(token),
        errors => this.errors = errors);
  }

  socialLogin(system: SocialLoginSystem) {
    const request = new TrySocialLogin({system});
    this.progress.login = true;
    this.socialLoginGQL.mutate(serialize(request))
      .pipe(finalize(() => this.progress.login = false),
        catchGQLErrors(),
        map(({data: {response}}) => deserialize(response, MakeSocialLogin)))
      .subscribe(({redirectUrl}) => {
          this.progress.redirecting = true;
          document.location.href = redirectUrl;
        },
        errors => this.errors = errors);
  }

  private logged(token: AuthToken) {
    this.config.token = token;
    this.progress.redirecting = true;
    this.router.navigate(['/projects'])
      .then(() => this.progress.redirecting = false);
  }

}
