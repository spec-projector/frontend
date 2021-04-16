import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UI } from '@junte/ui';
import { UI_DELAY } from '../../consts';
import { BackendError } from '../../types/gql-errors';
import { ChangePasswordGQL } from './change-password.graphql';
import { ChangePasswordInput } from './models';
import { serialize } from 'serialize-ts';
import { delay, finalize } from 'rxjs/operators';
import { catchGQLErrors } from '../../utils/gql-errors';

export function passwordMatchedValidator(form: FormGroup) {
  return form.get('password').value !== form.get('confirmation').value
    ? {mismatched: true} : null;
}

@Component({
  selector: 'spec-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {

  ui = UI;

  errors: BackendError[] = [];
  progress = {changing: false};

  confirmationControl = this.fb.control(null, [Validators.required]);
  form = this.fb.group({
    password: [null, [Validators.required]],
    confirmation: this.confirmationControl
  }, {validators: passwordMatchedValidator});

  @Output()
  saved = new EventEmitter();

  constructor(private changePasswordGQL: ChangePasswordGQL,
              private fb: FormBuilder) {
  }

  changePassword() {
    const request = new ChangePasswordInput(this.form.getRawValue());
    this.progress.changing = true;
    this.changePasswordGQL.mutate({input: serialize(request)})
      .pipe(delay(UI_DELAY), finalize(() => this.progress.changing = false),
        catchGQLErrors())
      .subscribe(() => this.saved.emit(),
        errors => this.errors = errors);
  }

}
