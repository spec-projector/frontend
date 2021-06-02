import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {UI} from '@junte/ui';
import {R} from 'apollo-angular/types';
import {finalize, map} from 'rxjs/operators';
import {deserialize} from 'serialize-ts';
import {User} from '../../../../models/user';
import {BackendError} from '../../../../types/gql-errors';
import {FindUserGQL} from '../../graphql';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'spec-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddMemberComponent {

  ui = UI;

  progress = {finding: false};
  state = {missed: false};
  errors: BackendError[] = [];

  form = this.fb.group(
    {
      email: [environment.production ? null : 'breslavsky.anton@gmail.com',
        [Validators.required, Validators.email]]
    }
  );

  @Output()
  found = new EventEmitter<User>();

  @ViewChild('content', {read: ElementRef})
  backdrop: ElementRef<HTMLElement>;

  constructor(private findUserGQL: FindUserGQL,
              private cd: ChangeDetectorRef,
              private fb: FormBuilder) {
  }

  find() {
    const {email} = this.form.getRawValue();
    this.progress.finding = true;
    this.state.missed = false;
    this.findUserGQL.fetch({email} as R)
      .pipe(finalize(() => {
          this.progress.finding = false;
          this.cd.markForCheck();
        }),
        map(({data: {user}}) => !!user ? deserialize(user, User) : null))
      .subscribe(u => {
        if (!!u) {
          this.found.emit(u);
          this.form.setValue({email: null});
        } else {
          this.state.missed = true;
        }
      });
  }

}
