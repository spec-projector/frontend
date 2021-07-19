import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UI } from '@junte/ui';
import { Subscription } from 'rxjs';
import { LocalUI } from 'src/enums/local-ui';
import { Feature } from 'src/models/spec/planning/feature/feature';
import { EditMode } from '../../../../../enums/edit-mode';
import { WorkflowStepState } from '../../../../../models/spec/planning/feature/workflow';
import { SpecManager } from '../../../managers/spec';

@Component({
  selector: 'spec-feature-edit',
  templateUrl: './feature-edit.component.html',
  styleUrls: ['./feature-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeatureEditComponent implements OnInit {

  ui = UI;
  localUi = LocalUI;
  workflowStepState = WorkflowStepState;

  feature: Feature;
  version = 0;

  constructor(private manager: SpecManager,
              private cd: ChangeDetectorRef,
              private route: ActivatedRoute) {
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

  }

}
