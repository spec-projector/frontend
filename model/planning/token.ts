import {persist, persistence} from '../../decorators/persistence';

export enum TokenType {
    text = 'text',
    term = 'term',
    accent = 'accent'
}

@persistence()
export class Token {

    constructor(defs: any = {}) {
        Object.assign(this, defs);
    }

    static parse(source: string): Token[] {
        return source.split(/(\{\{\w+\}\}|\[[\w\s]+\])/i)
            .map(t => t.trim())
            .filter(t => !!t)
            .map(t => {
                let match = t.match(/\{\{(\w+)\}\}/i);
                if (!!match) {
                    return new TermToken(match[1]);
                }

                match = t.match(/\[([\w\s]+)\]/i);
                if (!!match) {
                    return new AccentToken(match[1]);
                }
                return new TextToken(t);

            });
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
}

export class AccentToken extends Token {

    @persist()
    text: string;

    constructor(text: string) {
        super();
        this.text = text;
    }

    toString() {
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
}
