import { StoryEntry, StoryEntryType } from "src/model/spec/planning/feature";
import { Token } from "src/model/spec/planning/token";
import { TokenSerializer } from "src/model/spec/serializers/token";
import { ValidationError } from 'src/model/validation/error';
import { persist, persistence, Persistence } from 'src/decorators/persistence';
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
export class Integration {

    @persist()
    gitLabKey: string;

    @persist()
    gitHubKey: string;

    @persist()
    figmaKey: string;

    @persist()
    graphqlPlaygroundUrl: string;
}

@persistence()
export class ResourceType {

    @persist()
    title: string;

    @persist()
    hourRate: number;

    constructor(defs: any = {}) {
        Object.assign(this, defs);
    }

}

@persistence()
export class Spec extends Persistence {

    @persist()
    author: string;

    @persist()
    description: string;

    @persist({type: StoryEntry})
    integration: Integration = {
        gitLabKey: null,
        gitHubKey: null,
        figmaKey: null,
        graphqlPlaygroundUrl: null
    };

    @persist({type: ResourceType})
    resourceTypes: ResourceType[] = [];

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

    version = 0;

    constructor(defs: any = {}) {
        super();
        Object.assign(this, defs);
    }

    linking() {
        console.log('spec linking');
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

        for (const term of this.terms) {
            term.linking(this);
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
