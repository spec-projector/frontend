import { ChangeDetectionStrategy, Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UI } from '@junte/ui';
import { Language } from 'src/enums/language';
import { SpecManager } from 'src/managers/spec.manager';
import { Spec } from 'src/model/spec/spec';
import { Actor } from '../../../model/spec/planning/actor';

@Component({
  selector: 'spec-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrintComponent implements OnInit {

  ui = UI;
  language = Language;
  spec: Spec;

  constructor(public manager: SpecManager,
              private route: ActivatedRoute,
              @Inject(LOCALE_ID) public locale: string) {
  }

  ngOnInit() {
    this.route.data.subscribe(({spec}) => this.spec = spec);
  }

  trackActor(index: number, actor: Actor) {
    return !!actor ? actor.id : null;
  }

}
