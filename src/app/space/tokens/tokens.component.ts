import { Component, Input } from '@angular/core';
import { UI } from 'junte-ui';
import { Token, TokenType } from 'src/model/planning/token';

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