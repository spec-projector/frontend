import { Component, ComponentFactoryResolver, ElementRef, EventEmitter, Injector, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ModalService, PopoverService, UI } from 'junte-ui';
import { ClipboardService } from 'ngx-clipboard';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { FeatureMarkdownComponent } from 'src/app/components/spec/feature/markdown/feature-markdown.component';
import { LocalUI } from 'src/app/enums/local-ui';
import { SpecManager } from 'src/app/managers/spec.manager';
import { EditMode } from 'src/app/model/enums/edit-mode';
import { Feature, Resource, StoryEntry } from 'src/app/model/spec/planning/feature';
import { Frame } from 'src/app/model/spec/planning/frame';
import { Issue } from 'src/app/model/spec/planning/issue';
import { Graphql } from '../../../../model/spec/planning/graphql';

@Component({
  selector: 'spec-feature-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class FeatureEditComponent {

  ui = UI;
  localUi = LocalUI;
  editMode = EditMode;

  private _feature: Feature;

  mode = EditMode.view;

  @Input()
  set feature(feature: Feature) {
    this._feature = feature;
  }

  get feature() {
    return this._feature;
  }

  constructor(public manager: SpecManager,
              private fb: FormBuilder,
              private popover: PopoverService,
              private injector: Injector,
              private cfr: ComponentFactoryResolver,
              private modal: ModalService,
              private logger: NGXLogger) {
  }

  saveStory(story: StoryEntry[]) {
    this.logger.log('save story for feature [', this.feature.title.toString(), ']');
    this.feature.story = story;
    this.manager.put(this.feature);

    this.feature.version++;
  }

  saveResources(resources: Resource[]) {
    this.logger.log('save resources for feature [', this.feature.title.toString(), ']');
    this.feature.resources = resources;
    this.manager.put(this.feature);

    this.feature.version++;
  }

  saveFrames(frames: Frame[]) {
    this.logger.log('save frames for feature [', this.feature.title.toString(), ']');
    this.feature.frames = frames;
    this.manager.put(this.feature);

    this.feature.version++;
  }

  saveIssues(issues: Issue[]) {
    this.feature.issues = issues;
    this.manager.put(this.feature);

    this.feature.version++;
  }

  saveApi({graphql}: { graphql?: Graphql[] }) {
    if (!!graphql) {
      this.feature.graphql = graphql;
    }
    this.manager.put(this.feature);

    this.feature.version++;
  }

}
