import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UI, UploadImageData } from '@junte/ui';
import { BackendError } from '../../types/gql-errors';
import { UploadMeAvatarInput } from '../../models/image';
import { UpdateMeGQL, UploadMeAvatarGQL } from './change-personal-data.graphql';
import { catchGQLErrors } from '../../utils/gql-errors';
import { finalize, map } from 'rxjs/operators';
import { UpdateMeInput, User } from '../../models/user';
import { deserialize, serialize } from 'serialize-ts';
import { R } from 'apollo-angular/types';

@Component({
  selector: 'spec-change-personal-data',
  templateUrl: './change-personal-data.component.html',
  styleUrls: ['./change-personal-data.component.scss']
})
export class ChangePersonalDataComponent implements OnInit {

  ui = UI;

  errors: BackendError[] = [];
  progress = {changing: false, uploading: false};
  avatar: UploadImageData;

  form = this.fb.group({
    firstName: [null, [Validators.required]],
    lastName: [null, [Validators.required]],
    file: [null]
  });

  @Input()
  me: User;

  @Output()
  closed = new EventEmitter();

  @Output()
  changed = new EventEmitter();

  constructor(private fb: FormBuilder,
              private uploadMeAvatarGQL: UploadMeAvatarGQL,
              private updateMeGQL: UpdateMeGQL) {
  }

  ngOnInit() {
    this.form.patchValue({
      firstName: this.me.firstName,
      lastName: this.me.lastName,
      file: this.me.avatar
    });
  }

  uploadAvatar() {
    return (data: UploadImageData) => {
      const request = new UploadMeAvatarInput(data);
      this.progress.uploading = true;
      return this.uploadMeAvatarGQL.mutate({input: serialize(request)} as R, {
        context: {
          useMultipart: true
        }
      }).pipe(
        catchGQLErrors(),
        finalize(() => this.progress.uploading = false),
        map(({data: {response: {user: {avatar}}}}) => avatar));
    };
  }

  changePersonalData() {
    const request = new UpdateMeInput({
      firstName: this.form.get('firstName').value,
      lastName: this.form.get('lastName').value
    });
    this.progress.changing = true;
    this.updateMeGQL.mutate({input: serialize(request)} as R).pipe(
      catchGQLErrors(),
      finalize(() => this.progress.changing = false),
      map(({data: {response: {me}}}) => deserialize(me, User))
    ).subscribe(() => this.changed.emit());
  }
}
