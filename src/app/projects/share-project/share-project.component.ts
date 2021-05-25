import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UI } from '@junte/ui';
import { delay, finalize, map } from 'rxjs/operators';
import { deserialize, serialize } from 'serialize-ts';
import { UI_DELAY } from '../../../consts';
import { ProjectMemberRole, ProjectPermissions } from '../../../enums/project';
import { Project, ProjectUpdate } from '../../../models/projects';
import { User } from '../../../models/user';
import { BackendError } from '../../../types/gql-errors';
import { catchGQLErrors } from '../../../utils/gql-errors';
import { UpdateProjectGQL } from '../graphql';

@Component({
  selector: 'spec-share-project',
  templateUrl: './share-project.component.html',
  styleUrls: ['./share-project.component.scss']
})
export class ShareProjectComponent {

  ui = UI;
  projectMemberRole = ProjectMemberRole;
  projectPermissions = ProjectPermissions;

  private _project: Project;

  progress = {saving: false};
  errors: BackendError[] = [];

  form = this.fb.group(
    {
      isPublic: [false],
      publicRole: [ProjectMemberRole.viewer],
      publicPermissions: [null],
      members: this.fb.array([])
    }
  );

  @Input()
  set project(project: Project) {
    this._project = project;
    this.form.patchValue({
      isPublic: project.isPublic,
      publicRole: project.publicRole,
      publicPermissions: project.publicPermissions
    });
  }

  get project() {
    return this._project;
  }

  @Output()
  saved = new EventEmitter<Project>();

  @ViewChild('content', {read: ElementRef})
  backdrop: ElementRef<HTMLElement>;

  constructor(private updateProjectGQL: UpdateProjectGQL,
              private fb: FormBuilder) {
  }

  add(user: User) {

  }

  save() {
    const request = new ProjectUpdate(this.form.getRawValue());
    this.progress.saving = true;
    this.updateProjectGQL.mutate({id: this.project?.id, input: serialize(request)})
      .pipe(delay(UI_DELAY), finalize(() => this.progress.saving = false),
        catchGQLErrors(),
        map(({data: {response: {project}}}) => deserialize(project, Project)))
      .subscribe(project => this.saved.emit(project),
        errors => this.errors = errors);
  }

}
