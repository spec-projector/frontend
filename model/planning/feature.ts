import {TermToken, Token} from './token';
import {Issue} from './issue';
import {Frame} from './frame';
import {ArraySerializer, ModelSerializer} from 'serialize-ts';
import {Actor} from './actor';
import {Space} from '../space';
import {Epic} from './epic';
import {TermMissedError} from '../../validation/error';
import {Api} from './api';
import {Algorithm} from './algorithm';
import {TokenSerializer} from '../serializers/token';
import {Term} from './term';
import {persist, persistence, Persistence} from '../../decorators/persistence';
import {Entity} from '../orm/entity';

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

    linking(space: Space, actor: Actor = null, epic: Epic = null) {
        this.space = space;

        this.actor = actor || space.actors.find(a =>
            a.features.some(feature => feature.id === this.id));

        this.epic = epic || space.epics.find(e =>
            e.features.some(feature => feature.id === this.id));

        let entities = space.packages.reduce((res, pack) => res.concat(pack.entities), []);
        for (let i = 0; i < this.entities.length; i++) {
            let entity = this.entities[i];
            this.entities[i] = entities.find(e => e.id == entity.id);
        }
    }

    validate(space: Space) {
        if (!this.space) {
            return null;
            throw 'Object is not linked';
        }
        let errors: TermMissedError[] = [];
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
            .map((t1: TermToken) => this.space.terms.find(t2 => t2.name == t1.term))
            .filter(t => !!t);
    }

    getTerms() {
        if (!this.space) {
            throw 'Object is not linked';
        }
        let terms: Term[] = [];
        for (const entry of this.story) {
            if (!!entry.description.length) {
                terms = terms.concat(this.findTerms(entry.description)
                    .filter(x => terms.indexOf(x) == -1));
            }
        }

        let nested: Term[] = [];

        for (const term of terms) {
            nested = nested.concat(this.findTerms(term.description)
                .filter(x => nested.indexOf(x) == -1));
        }

        return terms.concat(nested.filter(x => terms.indexOf(x) == -1));
    }
}
