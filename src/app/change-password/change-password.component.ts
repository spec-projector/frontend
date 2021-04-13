import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UI } from '@junte/ui';
import { BackendError } from '../../types/gql-errors';
import { ChangePasswordGQL } from './change-password.graphql';
import { ChangePasswordInput } from './models';
import { serialize } from 'serialize-ts';
import { finalize } from 'rxjs/operators';
import { catchGQLErrors } from '../../utils/gql-errors';

export function passwordMatchedValidator(form: FormGroup) {
  return form.get('password').value !== form.get('confirmation').value
    ? {'mismatched': true} : null;
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
  closed = new EventEmitter();

  constructor(private fb: FormBuilder,
              private changePasswordGQL: ChangePasswordGQL) {
  }

  changePassword() {
    const request = new ChangePasswordInput(this.form.getRawValue());
    this.progress.changing = true;
    this.changePasswordGQL.mutate({input: serialize(request)})
      .pipe(finalize(() => this.progress.changing = false),
        catchGQLErrors()
      ).subscribe(() => this.closed.emit(),
      errors => this.errors = errors);
  }
}
