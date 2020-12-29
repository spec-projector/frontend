import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { deserialize, serialize } from 'serialize-ts';
import { UI } from '@junte/ui';
import { R } from 'apollo-angular/types';
import { finalize, map } from 'rxjs/operators';
import { Project, ProjectUpdate } from '../../../model/projects';
import { BackendError } from '../../../types/gql-errors';
import { CreateProjectGQL, UpdateProjectGQL } from '../projects.graphql';

@Component({
  selector: 'spec-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.scss']
})
export class EditProjectComponent {

  ui = UI;

  private _project: Project;

  progress = {saving: false};
  errors: BackendError[] = [];

  form = this.formBuilder.group(
    {
      id: [null],
      title: [null, Validators.required]
    }
  );

  @Input()
  set project(project: Project) {
    this._project = project;
    this.form.patchValue({
      id: project.id,
      title: project.title
    });
  }

  get project() {
    return this._project;
  }

  @Output()
  saved = new EventEmitter<Project>();

  constructor(private createProjectGQL: CreateProjectGQL,
              private updateProjectGQL: UpdateProjectGQL,
              private formBuilder: FormBuilder) {
  }

  save() {
    const mutation = !!this.project ? this.updateProjectGQL : this.createProjectGQL;
    const request = new ProjectUpdate(this.form.getRawValue());
    this.progress.saving = true;
    mutation.mutate(serialize(request) as R)
      .pipe(finalize(() => this.progress.saving = true),
        map(({data: {response: {project}}}) => deserialize(project, Project)))
      .subscribe(project => this.saved.emit(project),
        errors => this.errors = errors);
  }
}
