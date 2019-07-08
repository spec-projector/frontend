import {ModelSerializer, Serializer} from 'serialize-ts';
import {AccentToken, TermToken, TextToken, Token, TokenType, UrlToken} from '../planning/token';

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
            default:
                throw 'Wrong token type';

        }
    }
}
