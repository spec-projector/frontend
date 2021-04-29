import { Pipe, PipeTransform } from '@angular/core';
import { AccentToken, QuoteToken, TermToken, TextToken, Token, TokenType, UrlToken } from 'src/models/spec/planning/token';
import { joinTokens } from './utils';

@Pipe({name: 'joinTokens'})
export class JoinTokensPipe implements PipeTransform {
  transform(tokens: Token[]): string {
    return joinTokens(tokens);
  }
}

@Pipe({name: 'getTokenType'})
export class TokenTypePipe implements PipeTransform {
  transform(token: Token): TokenType {
    if (token instanceof TextToken) {
      return TokenType.text;
    } else if (token instanceof AccentToken) {
      return TokenType.accent;
    } else if (token instanceof UrlToken) {
      return TokenType.url;
    } else if (token instanceof TermToken) {
      return TokenType.term;
    } else if (token instanceof QuoteToken) {
      return TokenType.quote;
    }
  }
}
