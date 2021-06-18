import { ChangeDetectionStrategy, Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UI } from '@junte/ui';
import { Language } from 'src/enums/language';
import { SpecManager } from 'src/app/spec/managers/spec';
import { Spec } from 'src/models/spec/spec';
import { LocalUI } from '../../../enums/local-ui';
import { Actor } from '../../../models/spec/planning/actor';
import { trackElement } from '../../../utils/templates';

@Component({
  selector: 'spec-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrintComponent implements OnInit {

  ui = UI;
  localUi = LocalUI;
  language = Language;
  trackElement = trackElement;

  spec: Spec;
  version = 0;

  constructor(public manager: SpecManager,
              private route: ActivatedRoute,
              @Inject(LOCALE_ID) public locale: string) {
  }

  ngOnInit() {
    this.route.data.subscribe(({spec}) => this.spec = spec);
  }

}
