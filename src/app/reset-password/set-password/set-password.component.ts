import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormComponent, InputComponent, UI } from '@junte/ui';
import { finalize, map } from 'rxjs/operators';
import { deserialize, serialize } from 'serialize-ts';
import { AuthToken } from '../../../model/auth-token';
import { BackendError } from '../../../types/gql-errors';
import { catchGQLErrors } from '../../../utils/gql-errors';
import { AppConfig } from '../../app-config';
import { Distance } from '../../lp/animation';
import { ResetPasswordInput } from '../models';
import { RestorePasswordGQL, SendCodeGQL } from '../reset-password.graphql';

export function passwordMatchedValidator(form: FormGroup) {
  return form.get('password').value !== form.get('confirmation').value
    ? {'mismatched': true} : null;
}

@Component({
  selector: 'spec-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.scss']
})
export class SetPasswordComponent implements OnInit, AfterViewInit {

  ui = UI;
  distance = Distance;

  errors: BackendError[] = [];
  progress = {setting: false, redirecting: false};
  email: string;

  confirmationControl = this.fb.control(null, [Validators.required]);
  form = this.fb.group({
    code: [null, [Validators.required]],
    password: [null, [Validators.required]],
    confirmation: this.confirmationControl
  }, {validators: passwordMatchedValidator});

  @ViewChild(FormComponent)
  formComponent: FormComponent;

  @ViewChild('codeRef')
  codeRef: InputComponent;

  constructor(private fb: FormBuilder,
              private sendCodeGQL: SendCodeGQL,
              private restorePasswordGQL: RestorePasswordGQL,
              private config: AppConfig,
              private route: ActivatedRoute,
              public router: Router) {
  }

  ngOnInit() {
    const {email} = this.route.snapshot.params;
    this.email = email;
  }

  ngAfterViewInit() {
    setTimeout(() => this.codeRef.focus(), 100);
  }

  setPassword() {
    const {code, password} = this.form.getRawValue();
    const request = new ResetPasswordInput({email: this.email, code, password});
    this.progress.setting = true;
    this.restorePasswordGQL.mutate({input: serialize(request)})
      .pipe(finalize(() => this.progress.setting = false),
        catchGQLErrors(),
        map(({data: {response: {token}}}) => deserialize(token, AuthToken)),
      ).subscribe((token: AuthToken) => {
        this.config.token = token;
        this.progress.redirecting = true;
        this.router.navigate(['/projects'])
          .then(() => this.progress.redirecting = false);
      },
      errors => this.errors = errors);

  }

}
