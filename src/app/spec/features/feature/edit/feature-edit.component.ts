import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {UI} from '@junte/ui';
import {LocalUI} from 'src/enums/local-ui';
import {Feature, WorkflowStepState} from 'src/models/spec/planning/feature';
import {FormBuilder} from '@angular/forms';
import {SpecManager} from '../../../../../managers/spec.manager';

@Component({
  selector: 'spec-feature-edit',
  templateUrl: './feature-edit.component.html',
  styleUrls: ['./feature-edit.component.scss']
})
export class FeatureEditComponent implements OnInit {

  ui = UI;
  localUi = LocalUI;

  _feature: Feature;

  form = this.fb.group({
    workflow: this.fb.group({
      story: [WorkflowStepState.progress],
      design: [WorkflowStepState.progress],
      resources: [WorkflowStepState.progress],
      api: [WorkflowStepState.progress]
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

    this.form.valueChanges.subscribe(({workflow}) => {
      Object.assign(this.feature.workflow, workflow);
      this.manager.put(this.feature);
    });
  }

}
