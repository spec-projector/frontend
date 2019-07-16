import { persist, persistence, Persistence } from 'src/decorators/persistence';
import { ValidationError } from 'src/validation/error';
import { Package } from './orm/package';
import { Actor } from './planning/actor';
import { Epic } from './planning/epic';
import { Sprint } from './planning/sprint';
import { Term } from './planning/term';

@persistence()
class ErrorValidate {

    @persist()
    text: string;
}

@persistence()
export class Space extends Persistence {

    @persist({type: Actor})
    actors: Actor[] = [];

    @persist({type: Epic})
    epics: Epic[] = [];

    @persist({type: Sprint})
    sprints: Sprint[] = [];

    @persist({type: Term})
    terms: Term[] = [];

    @persist({type: Package})
    packages: Package[] = [];

    constructor(defs: any = {}) {
        super();
        Object.assign(this, defs);
    }

    linking() {
        for (const actor of this.actors) {
            actor.linking(this);
        }

        for (const epic of this.epics) {
            epic.linking(this);
        }

        for (const sprint of this.sprints) {
            sprint.linking(this);
        }

        for (const pack of this.packages) {
            pack.linking(this);
        }
    }

    validate() {
        let lost: ValidationError[] = [];

        for (const actor of this.actors) {
            const terms = actor.validate(this);
            if (!!terms) {
                lost = lost.concat(terms);
            }
        }

        for (const epic of this.epics) {
            const terms = epic.validateTerms(this);
            if (!!terms) {
                lost = lost.concat(terms);
            }
        }

        for (const sprint of this.sprints) {
            const terms = sprint.validateTerms(this);
            if (!!terms) {
                lost = lost.concat(terms);
            }
        }

        return lost;
    }
}