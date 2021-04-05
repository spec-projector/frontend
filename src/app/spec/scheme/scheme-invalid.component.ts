import {Component, Inject, LOCALE_ID} from '@angular/core';
import {UI} from '@junte/ui';
import {Language} from '../../../enums/language';

@Component({
  selector: 'app-spec-scheme-invalid',
  templateUrl: './scheme-invalid.component.html',
  styleUrls: ['./scheme-invalid.component.scss']
})
export class SchemeInvalidComponent {

  ui = UI;
  language = Language;

  constructor(@Inject(LOCALE_ID) public locale: string) {
  }

}
