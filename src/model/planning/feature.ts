import { persist, persistence, Persistence } from 'src/decorators/persistence';
import { Entity } from 'src/model/orm/entity';
import { TokenSerializer } from 'src/model/serializers/token';
import { Space } from 'src/model/space';
import { ArraySerializer } from 'serialize-ts';
import { TermMissedError } from 'src/validation/error';
import { Actor } from './actor';
import { Algorithm } from './algorithm';
import { Api } from './api';
import { Epic } from './epic';
import { Frame } from './frame';
import { Issue } from './issue';
import { Term } from './term';
import { TermToken, Token } from './token';

export enum StoryEntryType {
    see = 'see',
    can = 'can'
}

@persistence()
export class StoryEntry {

    @persist()
    type: StoryEntryType;

    @persist({serializer: new ArraySerializer(new TokenSerializer())})
    description: Token[];

    constructor(defs: any = {}) {
        Object.assign(this, defs);
    }
}

@persistence()
export class Feature extends Persistence {

    @persist({serializer: new ArraySerializer(new TokenSerializer())})
    title: Token[] = [];

    @persist({type: StoryEntry})
    story: StoryEntry[] = [];

    @persist({type: Issue})
    issues: Issue[] = [];

    @persist({type: Frame})
    frames: Frame[] = [];

    @persist({type: Api})
    endpoints: Api[] = [];

    @persist({type: Entity})
    entities: Entity[] = [];

    @persist({type: Algorithm})
    algorithms: Algorithm[] = [];

    space: Space;
    actor: Actor;
    epic: Epic;

    constructor(defs: any = {}) {
        super();
        Object.assign(this, defs);
    }

    linking({space, actor, epic}: { space?: Space, actor?: Actor, epic?: Epic }) {
        if (!!space) {
            this.space = space;
        }

        if (!!actor) {
            this.actor = actor;
        }

        if (!!epic) {
            this.epic = epic;
        }

        if (!!this.space) {
            const entities = this.space.packages.reduce((res, pack) => res.concat(pack.entities), []);
            for (let i = 0; i < this.entities.length; i++) {
                const entity = this.entities[i];
                this.entities[i] = entities.find(e => e.id === entity.id);
            }
        }
    }

    validate(space: Space) {
        if (!this.space) {
            throw new Error('Object is not linked');
        }
        const errors: TermMissedError[] = [];
        for (const token of this.title) {
            if (token instanceof TermToken) {
                const missed = token.validate(this.space.terms.map(t => t.name));
                if (!!missed) {
                    const error = new TermMissedError();
                    error.feature = this;
                    error.term = missed;

                    errors.push(error);
                }
            }
        }

        return errors.length ? errors : null;
    }

    private findTerms(tokens: Token[]) {
        return tokens.filter(t => t instanceof TermToken)
            .map((t1: TermToken) => this.space.terms.find(t2 => t2.name === t1.term))
            .filter(t => !!t);
    }

    getTerms() {
        if (!this.space) {
            throw new Error('Object is not linked');
        }
        let terms: Term[] = [];
        for (const entry of this.story) {
            if (!!entry.description.length) {
                terms = terms.concat(this.findTerms(entry.description)
                    .filter(x => terms.indexOf(x) === -1));
            }
        }

        let nested: Term[] = [];

        for (const term of terms) {
            nested = nested.concat(this.findTerms(term.description)
                .filter(x => nested.indexOf(x) === -1));
        }

        return terms.concat(nested.filter(x => terms.indexOf(x) === -1));
    }
}