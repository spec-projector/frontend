import { Component, Inject, LOCALE_ID } from '@angular/core';
import { UI } from '@junte/ui';
import { Language } from '../../../enums/language';
import { LocalUI } from '../../../enums/local-ui';

@Component({
  selector: 'spec-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent {

  ui = UI;
  localUi = LocalUI;
  language = Language;

  constructor(@Inject(LOCALE_ID) public locale: string) {
  }

}
