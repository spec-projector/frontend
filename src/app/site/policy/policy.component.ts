import {Component, Inject, LOCALE_ID} from '@angular/core';
import { UI } from '@junte/ui';
import {Language} from '../../../../../junte-ui/src/enums/language';

@Component({
  selector: 'spec-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.scss']
})
export class PolicyComponent {

  ui = UI;
  language = Language;

  constructor(@Inject(LOCALE_ID) public locale: string) {
  }

}
