import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UI } from '@junte/ui';
import { R } from 'apollo-angular/types';
import { finalize, map } from 'rxjs/operators';
import { deserialize } from 'serialize-ts';
import { User } from '../../../../models/user';
import { BackendError } from '../../../../types/gql-errors';
import { FindUserGQL } from '../../graphql';

@Component({
  selector: 'spec-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss']
})
export class AddMemberComponent {

  ui = UI;

  progress = {finding: false};
  errors: BackendError[] = [];

  form = this.fb.group(
    {
      email: [null, [Validators.required, Validators.email]]
    }
  );

  @Output()
  found = new EventEmitter<User>();

  @ViewChild('content', {read: ElementRef})
  backdrop: ElementRef<HTMLElement>;

  constructor(private findUserGQL: FindUserGQL,
              private fb: FormBuilder) {
  }

  find() {
    const {email} = this.form.getRawValue();
    this.progress.finding = true;
    this.findUserGQL.fetch({email} as R)
      .pipe(finalize(() => this.progress.finding = false),
        map(({data: {user}}) => deserialize(user, User)))
      .subscribe(u => this.found.emit(u));
  }

}
