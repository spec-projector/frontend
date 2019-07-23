import { Component, Input } from '@angular/core';
import { UI } from 'junte-ui';
import { Token, TokenType } from 'src/app/model/spec/planning/token';

@Component({
    selector: 'spec-tokens',
    templateUrl: './tokens.component.html',
    styleUrls: ['./tokens.component.scss']
})
export class TokensComponent {

    ui = UI;
    tokenType = TokenType;

    @Input() tokens: Token[] = [];

}
