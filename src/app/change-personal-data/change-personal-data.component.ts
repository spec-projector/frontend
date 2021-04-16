import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UI, UploadImageData } from '@junte/ui';
import { UI_DELAY } from '../../consts';
import { MeUpdated, SignalsService } from '../../signals/signals.service';
import { BackendError } from '../../types/gql-errors';
import { UploadMeAvatarInput } from './models';
import { UpdateMeGQL, UploadMeAvatarGQL } from './change-personal-data.graphql';
import { catchGQLErrors } from '../../utils/gql-errors';
import { delay, finalize, map } from 'rxjs/operators';
import { UpdateMeInput, User } from '../../models/user';
import { deserialize, serialize } from 'serialize-ts';
import { R } from 'apollo-angular/types';

@Component({
  selector: 'spec-change-personal-data',
  templateUrl: './change-personal-data.component.html',
  styleUrls: ['./change-personal-data.component.scss']
})
export class ChangePersonalDataComponent {

  ui = UI;

  errors: BackendError[] = [];
  progress = {changing: false, uploading: false};
  avatar: UploadImageData;

  form = this.fb.group({
    avatar: [null],
    firstName: [null, [Validators.required]],
    lastName: [null, [Validators.required]]
  });

  @Input()
  set me(me: User) {
    this.form.patchValue({
      firstName: me.firstName,
      lastName: me.lastName,
      avatar: me.avatar
    });
  }

  @Output()
  changed = new EventEmitter();

  constructor(private uploadMeAvatarGQL: UploadMeAvatarGQL,
              private updateMeGQL: UpdateMeGQL,
              private fb: FormBuilder,
              private signals: SignalsService) {
  }

  uploadAvatar() {
    return (data: UploadImageData) => {
      const request = new UploadMeAvatarInput(data);
      this.progress.uploading = true;
      return this.uploadMeAvatarGQL.mutate({input: serialize(request)} as R,
        {
          context: {
            useMultipart: true
          }
        }).pipe(finalize(() => this.progress.uploading = false),
        catchGQLErrors(),
        map(({data: {response: {user: {avatar}}}}) => avatar));
    };
  }

  changePersonalData() {
    const request = new UpdateMeInput(this.form.getRawValue());
    this.progress.changing = true;
    this.updateMeGQL.mutate({input: serialize(request)} as R)
      .pipe(delay(UI_DELAY),
        finalize(() => this.progress.changing = false),
        catchGQLErrors(),
        map(({data: {response: {me}}}) => deserialize(me, User)))
      .subscribe(() => {
        this.signals.dispatch(new MeUpdated());
        this.changed.emit();
      });
  }

}
