import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UI } from '@junte/ui';
import { delay, finalize, map } from 'rxjs/operators';
import { deserialize, serialize } from 'serialize-ts';
import { CURRENT_LANGUAGE, UI_DELAY } from '../../../../../../consts';
import { Language } from '../../../../../../enums/language';
import { Project, ProjectUpdate } from '../../../../../../models/project';
import { BackendError } from '../../../../../../types/gql-errors';
import { catchGQLErrors } from '../../../../../../utils/gql-errors';
import { SetGitLabTokenGQL } from './graphql';

@Component({
  selector: 'spec-add-gitlab-key',
  templateUrl: './add-gitlab-key.component.html',
  styleUrls: ['./add-gitlab-key.component.scss']
})
export class AddGitLabKeyComponent {

  ui = UI;
  language = Language;
  consts = {language: CURRENT_LANGUAGE};

  progress = {saving: false};
  errors: BackendError[] = [];

  @Input()
  project: Project;

  @Output()
  updated = new EventEmitter<Project>();

  form = this.fb.group({
    gitlabIntegration: this.fb.group({
      token: [null, Validators.required]
    })
  });

  constructor(private setGitLabTokenGQL: SetGitLabTokenGQL,
              private fb: FormBuilder) {
  }

  save() {
    const request = new ProjectUpdate(this.form.getRawValue());
    this.progress.saving = true;
    this.setGitLabTokenGQL.mutate({id: this.project?.id, input: serialize(request)})
      .pipe(delay(UI_DELAY), finalize(() => this.progress.saving = false),
        catchGQLErrors(),
        map(({data: {response: {project}}}) => deserialize(project, Project)))
      .subscribe(project => this.updated.emit(project),
        errors => this.errors = errors);
  }

}
