import { Pipe, PipeTransform } from '@angular/core';
import { AccentToken, TermToken, TextToken, Token, TokenType, UrlToken } from 'src/models/spec/planning/token';

@Pipe({name: 'joinTokens'})
export class JoinTokensPipe implements PipeTransform {
    transform(tokens: Token[]): string {
        return tokens.map(t => t.toText()).join(' ');
    }
}
