import { Component, Inject, LOCALE_ID  } from '@angular/core';
import { UI } from '@junte/ui';
import {Language} from '../../../../../junte-ui/src/enums/language';

@Component({
  selector: 'spec-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
})
export class SecurityComponent {

  ui = UI;
  language = Language;

  constructor(@Inject(LOCALE_ID) public locale: string) {
  }

}
