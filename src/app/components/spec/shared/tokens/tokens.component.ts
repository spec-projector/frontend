import { Component, Input } from '@angular/core';
import { UI } from 'junte-ui';
import { Token, TokenType } from 'src/app/model/spec/planning/token';
import { Spec } from 'src/app/model/spec/spec';

@Component({
    selector: 'spec-tokens',
    templateUrl: './tokens.component.html',
    styleUrls: ['./tokens.component.scss']
})
export class TokensComponent {

    ui = UI;
    tokenType = TokenType;

    @Input() spec: Spec;
    @Input() tokens: Token[] = [];
}
