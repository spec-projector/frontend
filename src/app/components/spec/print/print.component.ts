import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UI } from '@junte/ui';
import { SpecManager } from 'src/app/managers/spec.manager';
import { Spec } from 'src/app/model/spec/spec';
import { Actor } from '../../../model/spec/planning/actor';

@Component({
  selector: 'spec-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrintComponent implements OnInit {

  ui = UI;
  spec: Spec;

  constructor(public manager: SpecManager,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.data.subscribe(({spec}) => this.spec = spec);
  }

  trackActor(index: number, actor: Actor) {
    return !!actor ? actor.id : null;
  }

}
