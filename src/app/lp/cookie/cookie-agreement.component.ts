import { Component, EventEmitter, Output } from '@angular/core';
import { UI } from '@junte/ui';
import { LocalUI } from '../../../enums/local-ui';

@Component({
    selector: 'spec-cookie-agreement',
    templateUrl: './cookie-agreement.component.html',
    styleUrls: ['./cookie-agreement.component.scss']
})
export class CookieAgreementComponent {

    ui = UI;
    localUi = LocalUI;

    @Output()
    agree = new EventEmitter();
}
