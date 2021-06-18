import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UI } from '@junte/ui';
import { delay, finalize, map } from 'rxjs/operators';
import { deserialize, serialize } from 'serialize-ts';
import { BASE_URI, CURRENT_LANGUAGE, UI_DELAY } from '../../../consts';
import { ALL_PROJECT_PERMISSIONS, ProjectMemberRole, ProjectPermission } from '../../../enums/project';
import { Project, ProjectMember, ProjectUpdate } from '../../../models/project';
import { User } from '../../../models/user';
import { BackendError } from '../../../types/gql-errors';
import { catchGQLErrors } from '../../../utils/gql-errors';
import { UpdateProjectGQL } from '../graphql';

@Component({
  selector: 'spec-share-project',
  templateUrl: './share-project.component.html',
  styleUrls: ['./share-project.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShareProjectComponent {

  ui = UI;
  projectMemberRole = ProjectMemberRole;
  projectPermissions = ProjectPermission;

  private _project: Project;

  progress = {saving: false};
  errors: BackendError[] = [];

  membersArray = this.fb.array([]);
  form = this.fb.group(
    {
      isPublic: [false],
      publicRole: [ProjectMemberRole.viewer],
      publicPermissions: [[]],
      publicLink: [null],
      members: this.membersArray
    }
  );

  @Input()
  set project(project: Project) {
    this._project = project;
    this.form.patchValue({
      isPublic: project.isPublic,
      publicRole: project.publicRole,
      publicPermissions: project.publicPermissions,
      publicLink: [BASE_URI, CURRENT_LANGUAGE, 'projects', project.id].join('/')
    });
    project.members.forEach(m => {
      const g = this.createMemberGroup(m.user.id, m.role, m.permissions);
      this.membersArray.push(g);
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
              private cd: ChangeDetectorRef,
              private fb: FormBuilder) {
  }

  add(user: User) {
    const g = this.createMemberGroup(user.id, ProjectMemberRole.editor, ALL_PROJECT_PERMISSIONS);
    this.membersArray.push(g);
    this.project.members.push(new ProjectMember({
      user,
      role: ProjectMemberRole.editor,
      permissions: ALL_PROJECT_PERMISSIONS
    }));
  }

  revoke(index: number) {
    this.membersArray.removeAt(index);
    this.project.members.splice(index, 1);
    // this.cd.markForCheck();
  }

  save() {
    const request = new ProjectUpdate(this.form.getRawValue());
    console.log(request);
    this.progress.saving = true;
    this.updateProjectGQL.mutate({id: this.project?.id, input: serialize(request)})
      .pipe(delay(UI_DELAY), finalize(() => {
          this.progress.saving = false;
          this.cd.markForCheck();
        }),
        catchGQLErrors(),
        map(({data: {response: {project}}}) => deserialize(project, Project)))
      .subscribe(project => this.saved.emit(project),
        errors => this.errors = errors);
  }

  private createMemberGroup(user: string, role: ProjectMemberRole, permissions: ProjectPermission[]) {
    return this.fb.group({
      id: [user],
      role: [role],
      permissions: [permissions]
    });
  }

}
