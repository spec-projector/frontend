import { Component, Inject, LOCALE_ID } from '@angular/core';
import { UI } from '@junte/ui';
import { Language } from '../../../enums/language';
import { LocalUI } from '../../../enums/local-ui';

@Component({
  selector: 'spec-agreement',
  templateUrl: './agreement.component.html',
  styleUrls: ['./agreement.component.scss']
})
export class AgreementComponent {

  ui = UI;
  localUi = LocalUI;
  language = Language;

  constructor(@Inject(LOCALE_ID) public locale: string) {
  }

}
