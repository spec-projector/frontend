import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UI } from '@junte/ui';
import { LocalUI } from 'src/enums/local-ui';
import { Feature } from 'src/models/spec/planning/feature/feature';
import { EditMode } from '../../../../../enums/edit-mode';
import { WorkflowStepState } from '../../../../../models/spec/planning/feature/workflow';
import { SpecManager } from '../../../managers';

@Component({
  selector: 'spec-feature-edit',
  templateUrl: './feature-edit.component.html',
  styleUrls: ['./feature-edit.component.scss']
})
export class FeatureEditComponent implements OnInit {

  ui = UI;
  localUi = LocalUI;
  workflowStepState = WorkflowStepState;

  _feature: Feature;

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

  constructor(private manager: SpecManager,
              private route: ActivatedRoute,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.route.data.subscribe(({feature}) => this.feature = feature);
    this.manager.mode$.subscribe(mode => mode === EditMode.edit ? this.form.enable() : this.form.disable());

    this.form.valueChanges.subscribe(({workflow}) => {
      Object.assign(this.feature.workflow, workflow);
      this.manager.put(this.feature);
    });
  }

}
