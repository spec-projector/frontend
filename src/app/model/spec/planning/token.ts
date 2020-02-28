import { persist, persistence } from 'src/decorators/persistence';

export enum TokenType {
    text = 'text',
    term = 'term',
    accent = 'accent',
    url = 'url'
}

@persistence()
export class Token {

    constructor(defs: any = {}) {
        Object.assign(this, defs);
    }

    static parse(source: string): Token[] {
        return source.split(/({{[^\[\]]+}}|\[[^\[\]]+]|[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b[-a-zA-Z0-9@:%_+.~#?&//=]*)/i)
            .map(t => t.trim())
            .filter(t => !!t)
            .map(t => {
                let match = t.match(/{{([^\[\]]+)}}/i);
                if (!!match) {
                    return new TermToken(match[1]);
                }

                match = t.match(/\[([^\[\]]+)]/i);
                if (!!match) {
                    return new AccentToken(match[1]);
                }

                match = t.match(/([-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b[-a-zA-Z0-9@:%_+.~#?&//=]*)/i);
                if (!!match) {
                    return new UrlToken(match[1]);
                }
                return new TextToken(t);

            });
    }

    toText() {
        throw 'Must be rewritten';
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

    validate(terms: string[]) {
        return !terms.includes(this.term) ? this.term : null;
    }

    toString() {
        return `{{${this.term}}}`;
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
