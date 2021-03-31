import { Component, Inject, LOCALE_ID } from '@angular/core';
import { UI } from '@junte/ui';
import {Language} from '../../../../../junte-ui/src/enums/language';

@Component({
  selector: 'spec-agreement',
  templateUrl: './agreement.component.html',
  styleUrls: ['./agreement.component.scss']
})
export class AgreementComponent {

  ui = UI;
  language = Language;

  constructor(@Inject(LOCALE_ID) public locale: string) {
  }

}
