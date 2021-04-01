import { Component, Inject, LOCALE_ID } from '@angular/core';
import { UI } from '@junte/ui';
import { Language } from '../../../enums/language';

@Component({
  selector: 'spec-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent {

  ui = UI;
  language = Language;

  constructor(@Inject(LOCALE_ID) public locale: string) {
  }

}
