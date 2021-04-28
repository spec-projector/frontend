import { Serializer } from 'serialize-ts';
import { AccentToken, QuoteToken, TermToken, TextToken, Token, TokenType, UrlToken } from '../models/spec/planning/token';

export class TokenSerializer implements Serializer<Object> {

  serialize(token: Token) {
    if (token instanceof TextToken) {
      return {type: TokenType.text, text: token.text};
    } else if (token instanceof AccentToken) {
      return {type: TokenType.accent, text: token.text};
    } else if (token instanceof UrlToken) {
      return {type: TokenType.url, url: token.url};
    } else if (token instanceof TermToken) {
      return {type: TokenType.term, term: token.term};
    } else if (token instanceof QuoteToken) {
      return {type: TokenType.quote, text: token.text};
    }
  }

  deserialize(json: Object): Token {
    switch (json['type']) {
      case TokenType.text:
        return new TextToken(json['text']);
      case TokenType.accent:
        return new AccentToken(json['text']);
      case TokenType.url:
        return new UrlToken(json['url']);
      case TokenType.term:
        return new TermToken(json['term']);
      case TokenType.quote:
        return new QuoteToken(json['text']);
      default:
        return new TextToken(json['Wrong token type']);

    }
  }
}
