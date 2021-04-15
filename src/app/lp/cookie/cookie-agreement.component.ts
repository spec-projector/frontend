import { Component, EventEmitter, Inject, LOCALE_ID, Output } from '@angular/core';
import { UI } from '@junte/ui';
import { Language } from '../../../enums/language';
import { LocalUI } from '../../../enums/local-ui';

@Component({
  selector: 'spec-cookie-agreement',
  templateUrl: './cookie-agreement.component.html',
  styleUrls: ['./cookie-agreement.component.scss']
})
export class CookieAgreementComponent {

  ui = UI;
  localUi = LocalUI;
  language = Language;

  @Output()
  agree = new EventEmitter();

  constructor(@Inject(LOCALE_ID) public locale: string) {

  }
}
