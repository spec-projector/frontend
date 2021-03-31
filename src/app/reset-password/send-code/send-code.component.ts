import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormComponent, InputComponent, UI } from '@junte/ui';
import { finalize } from 'rxjs/operators';
import { serialize } from 'serialize-ts';
import { BackendError } from '../../../types/gql-errors';
import { catchGQLErrors } from '../../../utils/gql-errors';
import { Distance } from '../../lp/animation';
import { SecurityCodeRequest } from '../models';
import { SendCodeGQL } from '../reset-password.graphql';

@Component({
  selector: 'spec-send-code',
  templateUrl: './send-code.component.html',
  styleUrls: ['./send-code.component.scss']
})
export class SendCodeComponent implements AfterViewInit {

  ui = UI;
  distance = Distance;

  errors: BackendError[] = [];
  progress = {sending: false};

  form = this.fb.group({
    email: [null, [Validators.required, Validators.email]]
  });

  @ViewChild(FormComponent)
  formComponent: FormComponent;

  @ViewChild('emailRef')
  emailRef: InputComponent;

  constructor(private fb: FormBuilder,
              private sendCodeGQL: SendCodeGQL,
              private route: ActivatedRoute,
              public router: Router) {
  }

  ngAfterViewInit() {
    setTimeout(() => this.emailRef.focus(), 100);
  }

  submit() {
    this.formComponent.submit();
  }

  sendCode() {
    const {email} = this.form.getRawValue();
    const request = new SecurityCodeRequest({email});
    this.progress.sending = true;
    this.sendCodeGQL.mutate({input: serialize(request)})
      .pipe(finalize(() => this.progress.sending = false),
        catchGQLErrors())
      .subscribe(() => this.router.navigate(['set-password', {email}], {relativeTo: this.route}),
        errors => this.errors = errors);
  }

}
