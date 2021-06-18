import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UI } from '@junte/ui';
import { SpecManager } from 'src/app/spec/managers/spec';
import { Spec } from 'src/models/spec/spec';
import { Language } from '../../../enums/language';
import { LocalUI } from '../../../enums/local-ui';
import { WorkflowStepState } from '../../../models/spec/planning/feature/workflow';

@Component({
  selector: 'spec-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {

  ui = UI;
  language = Language;
  localUi = LocalUI;
  workflowStepState = WorkflowStepState;

  spec: Spec;

  constructor(public manager: SpecManager,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.data.subscribe(({spec}) => this.spec = spec);
  }

}
