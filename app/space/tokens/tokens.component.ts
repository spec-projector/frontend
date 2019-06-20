import {Component, Input} from '@angular/core';
import {Token, TokenType} from '../../../model/planning/token';
import {UI} from 'junte-ui';

@Component({
    selector: 'app-tokens',
    templateUrl: './tokens.component.html',
    styleUrls: ['./tokens.component.scss']
})
export class TokensComponent {

    ui = UI;
    tokenType = TokenType;

    @Input() tokens: Token[] = [];

}
