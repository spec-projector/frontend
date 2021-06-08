import { Component } from '@angular/core';
import { UI } from '@junte/ui';
import { CURRENT_LANGUAGE } from '../../../consts';
import { Language } from '../../../enums/language';

@Component({
  selector: 'app-spec-scheme-invalid',
  templateUrl: './scheme-invalid.component.html',
  styleUrls: ['./scheme-invalid.component.scss']
})
export class SchemeInvalidComponent {

  ui = UI;
  language = Language;
  consts = {language: CURRENT_LANGUAGE};

}
