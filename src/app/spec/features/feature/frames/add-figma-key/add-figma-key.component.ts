import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UI } from '@junte/ui';
import { delay, finalize, map } from 'rxjs/operators';
import { deserialize, serialize } from 'serialize-ts';
import { CURRENT_LANGUAGE, UI_DELAY } from '../../../../../../consts';
import { Language } from '../../../../../../enums/language';
import { Project, ProjectUpdate } from '../../../../../../models/projects';
import { BackendError } from '../../../../../../types/gql-errors';
import { catchGQLErrors } from '../../../../../../utils/gql-errors';
import { SetFigmaTokenGQL } from './graphql';

@Component({
  selector: 'spec-add-figma-key',
  templateUrl: './add-figma-key.component.html',
  styleUrls: ['./add-figma-key.component.scss']
})
export class AddFigmaKeyComponent {

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
    figmaIntegration: this.fb.group({
      token: [null, Validators.required]
    })
  });

  constructor(private setFigmaTokenGQL: SetFigmaTokenGQL,
              private fb: FormBuilder) {
  }

  save() {
    const request = new ProjectUpdate(this.form.getRawValue());
    this.progress.saving = true;
    this.setFigmaTokenGQL.mutate({id: this.project?.id, input: serialize(request)})
      .pipe(delay(UI_DELAY), finalize(() => this.progress.saving = false),
        catchGQLErrors(),
        map(({data: {response: {project}}}) => deserialize(project, Project)))
      .subscribe(project => this.updated.emit(project),
        errors => this.errors = errors);
  }

}
