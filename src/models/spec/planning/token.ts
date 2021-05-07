import { persist, persistence } from 'src/decorators/persistence';
import * as assign from 'assign-deep';

const TOKENS_REGEX = {
  quote: '\\"([^\\"]+)\\"',
  term: '\\[\\[([^\\[\\]]+)\\]\\]',
  accent: '\\[([^\\[\\]]+)\\]',
  url: '([-a-zA-Z0-9@:%._+~#=]{2,256}\\.[a-z]{2,6}\\b[-a-zA-Z0-9@:%_+.~#?&//=]*)'
};


export enum TokenType {
  text = 'text',
  term = 'term',
  accent = 'accent',
  url = 'url',
  quote = 'quote'
}

@persistence()
export class Token {

  constructor(defs: Partial<Token> = {}) {
    assign(this, defs);
  }

  static parse(source: string): Token[] {
    const regex = [TOKENS_REGEX.term, TOKENS_REGEX.accent, TOKENS_REGEX.url, TOKENS_REGEX.quote]
      .map(r => r.replace('(', '').replace(')', ''));
    return source.split(new RegExp('(' + regex.join('|') + ')', 'ig'))
      .map(t => t.trim())
      .filter(t => !!t)
      .map(t => {
        let match = t.match(new RegExp(TOKENS_REGEX.term));
        if (!!match) {
          return new TermToken(match[1]);
        }

        match = t.match(new RegExp(TOKENS_REGEX.accent));
        if (!!match) {
          return new AccentToken(match[1]);
        }

        match = t.match(new RegExp(TOKENS_REGEX.url));
        if (!!match) {
          return new UrlToken(match[1]);
        }

        match = t.match(new RegExp(TOKENS_REGEX.quote));
        if (!!match) {
          return new QuoteToken(match[1]);
        }

        return new TextToken(t);

      });
  }

  toText() {
    throw new Error('Must be over written');
  }
}

export class TextToken extends Token {

  @persist()
  text: string;

  constructor(text: string) {
    super();
    this.text = text;
  }

  toString() {
    return this.text;
  }

  toText() {
    return this.text;
  }
}

export class QuoteToken extends Token {

  @persist()
  text: string;

  constructor(text: string) {
    super();
    this.text = text;
  }

  toString() {
    return `"${this.text}"`;
  }

  toText() {
    return this.text;
  }
}

export class AccentToken extends Token {

  @persist()
  text: string;

  constructor(text: string) {
    super();
    this.text = text;
  }

  toString() {
    return `[${this.text}]`;
  }

  toText() {
    return this.text;
  }
}

export class TermToken extends Token {

  @persist()
  term: string;

  constructor(term: string) {
    super();
    this.term = term;
  }

  toString() {
    return `[[${this.term}]]`;
  }

  toText() {
    return this.term;
  }
}

export class UrlToken extends Token {

  @persist()
  url: string;

  constructor(url: string) {
    super();
    this.url = url;
  }

  toString() {
    return this.url;
  }

  toText() {
    return this.url;
  }

}
