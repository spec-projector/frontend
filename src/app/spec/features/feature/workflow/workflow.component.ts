import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UI } from '@junte/ui';
import { Subscription } from 'rxjs';
import { EditMode } from '../../../../../enums/edit-mode';
import { LocalUI } from '../../../../../enums/local-ui';
import { Feature } from '../../../../../models/spec/planning/feature/feature';
import { WorkflowStepState } from '../../../../../models/spec/planning/feature/workflow';
import { SpecManager } from '../../../managers';

@Component({
  selector: 'spec-feature-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeatureWorkflowComponent implements OnInit, OnDestroy {

  ui = UI;
  localUi = LocalUI;
  workflowStepState = WorkflowStepState;

  private _feature: Feature;
  private subscriptions: {
    feature?: Subscription
  } = {};

  storyControl = this.fb.control(WorkflowStepState.doing);
  designControl = this.fb.control(WorkflowStepState.doing);
  resourcesControl = this.fb.control(WorkflowStepState.doing);
  apiControl = this.fb.control(WorkflowStepState.doing);
  developingControl = this.fb.control(WorkflowStepState.doing);
  testingControl = this.fb.control(WorkflowStepState.doing);
  acceptingControl = this.fb.control(WorkflowStepState.doing);

  form = this.fb.group({
    workflow: this.fb.group({
      story: this.storyControl,
      design: this.designControl,
      resources: this.resourcesControl,
      api: this.apiControl,
      developing: this.developingControl,
      testing: this.testingControl,
      accepting: this.acceptingControl
    })
  });

  set feature(feature: Feature) {
    this._feature = feature;

    this.subscriptions.feature?.unsubscribe();
    this.subscriptions.feature = feature.updated$.subscribe(() => {
      this.version++;
      this.cd.markForCheck();
    });

    const {workflow} = feature;
    this.form.patchValue({
      workflow: {
        story: workflow.story,
        design: workflow.design,
        resources: workflow.resources,
        api: workflow.api,
        developing: workflow.developing,
        testing: workflow.testing,
        accepting: workflow.accepting
      }
    }, {emitEvent: false});
  }

  get feature() {
    return this._feature;
  }

  version = 0;

  constructor(private manager: SpecManager,
              private cd: ChangeDetectorRef,
              private route: ActivatedRoute,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.route.data.subscribe(({feature}) => {
      this.feature = feature;
      // TODO: remove for soon
      if (!feature.api.id) {
        feature.api.new();
        this.manager.put(feature.api);
        this.manager.put(feature);
      }

      if (!feature.workflow.id) {
        feature.workflow.new();
        this.manager.put(feature.workflow);
        this.manager.put(feature);
      }
    });
    this.manager.mode$.subscribe(mode => {
      mode === EditMode.edit
        ? this.form.enable() : this.form.disable();
      this.cd.markForCheck();
    });

    this.form.valueChanges.subscribe(({workflow}) => {
      Object.assign(this.feature.workflow, workflow);
      this.manager.put(this.feature.workflow);
    });
  }

  ngOnDestroy() {
    [this.subscriptions.feature]
      .forEach(s => s?.unsubscribe());
  }

}
