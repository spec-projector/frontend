import { ChangeDetectionStrategy, Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UI } from '@junte/ui';
import { SpecManager } from 'src/app/spec/managers/spec';
import { Language } from 'src/enums/language';
import { Spec } from 'src/models/spec/spec';
import { CURRENT_LANGUAGE } from '../../../consts';
import { LocalUI } from '../../../enums/local-ui';
import { StoryEntryType } from '../../../models/spec/planning/feature/story';
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
  storyEntryType = StoryEntryType;
  consts = {language: CURRENT_LANGUAGE};
  trackElement = trackElement;

  spec: Spec;

  constructor(public manager: SpecManager,
              private route: ActivatedRoute,
              @Inject(LOCALE_ID) public locale: string) {
  }

  ngOnInit() {
    this.route.data.subscribe(({spec}) => this.spec = spec);
  }

}
