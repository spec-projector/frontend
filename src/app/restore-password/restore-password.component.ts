import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormComponent, UI } from '@junte/ui';
import 'reflect-metadata';
import { BackendError } from '../../types/gql-errors';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResetPasswordInput, SendPasswordResetSecurityCodeInput } from '../../model/user';
import { RestorePasswordGQL, SendCodeGQL } from './restore-password.graphql';
import { finalize, map } from 'rxjs/operators';
import { catchGQLErrors } from '../../utils/gql-errors';
import { deserialize, serialize } from 'serialize-ts';
import { Router } from '@angular/router';
import { Distance, moveKeyframes } from '../lp/animation';
import { state, style, transition, trigger } from '@angular/animations';
import { Authorization } from '../../model/authorization';
import { AppConfig } from '../app-config';

const ANIMATION_DURATION = 2000;

enum View {
  sendCode = 'sendCode',
  restore = 'restore'
}

export function passwordMatchedValidator(form: FormGroup) {
  return form.get('password').value !== form.get('confirmation').value
    ? {'mismatched': true} : null;
}

@Component({
  selector: 'spec-restore-password',
  templateUrl: './restore-password.component.html',
  styleUrls: ['./restore-password.component.scss'],
  animations: [
    trigger('move', [
      state('*', style({transform: 'translate3D({{distance}})'}), {params: {distance: '0,0,0'}}),
      transition('void => *', moveKeyframes, {params: {distance: '0,0,0'}}),
    ])
  ]
})
export class RestorePasswordComponent {

  ui = UI;
  private _view: View = View.sendCode;

  errors: BackendError[] = [];
  progress = {sendCode: false, restore: false};
  distance = Distance;
  views = View;

  @ViewChild('formComponent')
  formComponent: FormComponent;

  set view(view: View) {
    this._view = view;
    if (view === View.restore) {
      this.codeControl.setValidators([Validators.required]);
      this.passwordControl.setValidators([Validators.required]);
      this.confirmationControl.setValidators([Validators.required]);
    }
  }

  get view() {
    return this._view;
  }

  @ViewChild('content', {read: ElementRef})
  backdrop: ElementRef<HTMLElement>;

  emailControl = this.fb.control(null, [Validators.required, Validators.email]);
  codeControl = this.fb.control(null);
  passwordControl = this.fb.control(null);
  confirmationControl = this.fb.control(null);
  warnings: AbstractControl[] = [];

  form = this.fb.group({
    email: this.emailControl,
    code: this.codeControl,
    password: this.passwordControl,
    confirmation: this.confirmationControl
  }, {validators: passwordMatchedValidator});

  constructor(private fb: FormBuilder,
              private sendCodeGQL: SendCodeGQL,
              private restorePasswordGQL: RestorePasswordGQL,
              private config: AppConfig,
              public router: Router) {
  }

  sendCode() {
    const request = new SendPasswordResetSecurityCodeInput(this.form.getRawValue());
    this.progress.sendCode = true;
    this.sendCodeGQL.mutate({input: serialize(request)})
      .pipe(finalize(() => this.progress.sendCode = false),
        catchGQLErrors(),
      ).subscribe(() => this.view = View.restore,
      errors => this.errors = errors);
  }

  restore() {
    const request = new ResetPasswordInput(this.form.getRawValue());
    this.progress.restore = true;
    this.restorePasswordGQL.mutate({input: serialize(request)})
      .pipe(finalize(() => this.progress.restore = false),
        catchGQLErrors(),
        map(({data: {resetPassword: {token}}}) =>
          deserialize(token, Authorization)),
      ).subscribe((token: Authorization) => this.logged(token),
      errors => this.errors = errors);
  }

  private logged(authorization: Authorization) {
    this.config.authorization = authorization;
    this.formComponent.success();
    setTimeout(() => this.router.navigate(['/']).then(() => null), ANIMATION_DURATION);
  }
}
