import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { InputComponent, UI, UploadImageData } from '@junte/ui';
import { R } from 'apollo-angular/types';
import { delay, finalize, map } from 'rxjs/operators';
import { deserialize, serialize } from 'serialize-ts';
import { UI_DELAY } from '../../../consts';
import { UploadImageGQL } from '../../../graphql/image';
import { Image, UploadImageInput } from '../../../models/image';
import { Project, ProjectUpdate } from '../../../models/projects';
import { BackendError } from '../../../types/gql-errors';
import { catchGQLErrors } from '../../../utils/gql-errors';
import { CreateProjectGQL, UpdateProjectGQL } from '../graphql';

@Component({
  selector: 'spec-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.scss']
})
export class EditProjectComponent implements AfterViewInit {

  ui = UI;

  private _project: Project;

  progress = {saving: false, uploading: false};
  errors: BackendError[] = [];

  form = this.fb.group(
    {
      emblem: [null],
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
      emblem: project.emblem?.id || null,
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
              private uploadImageGQL: UploadImageGQL,
              private fb: FormBuilder) {
  }

  ngAfterViewInit() {
    setTimeout(() => this.titleInput.focus(), 100);
  }

  uploadEmblem() {
    return (data: UploadImageData) => {
      const request = new UploadImageInput(data);
      this.progress.uploading = true;
      return this.uploadImageGQL.mutate({input: serialize(request)} as R,
        {
          context: {
            useMultipart: true
          }
        }).pipe(finalize(() => this.progress.uploading = false),
        catchGQLErrors(),
        map(({data: {response: {image}}}) => deserialize(image, Image)));
    };
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
