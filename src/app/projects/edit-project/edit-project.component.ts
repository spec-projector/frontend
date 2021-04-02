import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { InputComponent, UI } from '@junte/ui';
import { delay, finalize, map } from 'rxjs/operators';
import { deserialize, serialize } from 'serialize-ts';
import { UI_DELAY } from '../../../consts';
import { Project, ProjectUpdate } from '../../../models/projects';
import { BackendError } from '../../../types/gql-errors';
import { catchGQLErrors } from '../../../utils/gql-errors';
import { CreateProjectGQL, UpdateProjectGQL } from '../projects.graphql';

@Component({
  selector: 'spec-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.scss']
})
export class EditProjectComponent implements AfterViewInit {

  ui = UI;

  private _project: Project;

  progress = {saving: false};
  errors: BackendError[] = [];

  form = this.fb.group(
    {
      title: [null, Validators.required],
      description: [null, Validators.required],
      isPublic: [false],
      figmaIntegration: this.fb.group({
        token: [null]
      }),
      gitlabIntegration: this.fb.group({
        token: [null]
      }),
      githubIntegration: this.fb.group({
        token: [null]
      })
    }
  );

  @Input()
  set project(project: Project) {
    this._project = project;
    this.form.patchValue({
      title: project.title,
      description: project.description,
      isPublic: project.isPublic,
      figmaIntegration: {
        token: project.figmaIntegration?.token || null
      },
      gitlabIntegration: {
        token: project.gitlabIntegration?.token || null
      },
      githubIntegration: {
        token: project.githubIntegration?.token || null
      }
    });
  }

  get project() {
    return this._project;
  }

  @Output()
  saved = new EventEmitter<Project>();

  @ViewChild('titleInput')
  titleInput: InputComponent;

  @ViewChild('content', {read: ElementRef})
  backdrop: ElementRef<HTMLElement>;

  constructor(private createProjectGQL: CreateProjectGQL,
              private updateProjectGQL: UpdateProjectGQL,
              private fb: FormBuilder) {
  }

  ngAfterViewInit() {
    setTimeout(() => this.titleInput.focus(), 100);
  }

  save() {
    const mutation = !!this.project ? this.updateProjectGQL : this.createProjectGQL;
    const request = new ProjectUpdate(this.form.getRawValue());
    this.progress.saving = true;
    mutation.mutate({id: this.project?.id, input: serialize(request)})
      .pipe(delay(UI_DELAY), finalize(() => this.progress.saving = false),
        catchGQLErrors(),
        map(({data: {response: {project}}}) => deserialize(project, Project)))
      .subscribe(project => this.saved.emit(project),
        errors => this.errors = errors);
  }

}
