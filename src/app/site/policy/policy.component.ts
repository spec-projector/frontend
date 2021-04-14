import {Component, Inject, LOCALE_ID} from '@angular/core';
import { UI } from '@junte/ui';
import { Language } from '../../../enums/language';
import { LocalUI } from '../../../enums/local-ui';

@Component({
  selector: 'spec-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.scss']
})
export class PolicyComponent {

  ui = UI;
  localUi = LocalUI;
  language = Language;

  constructor(@Inject(LOCALE_ID) public locale: string) {
  }

}
