import { persist, persistence, Persistence } from 'src/decorators/persistence';
import { StoryEntry } from 'src/models/spec/planning/feature';
import { ValidationError } from 'src/models/validation/error';
import { Package } from './orm/package';
import { Actor } from './planning/actor';
import { Epic } from './planning/epic';
import { Sprint } from './planning/sprint';
import { Term } from './planning/term';
import * as assign from 'assign-deep';

@persistence()
class ErrorValidate {

  @persist()
  text: string;
}

@persistence()
export class Integration {

  @persist()
  graphqlPlaygroundUrl: string;

  constructor(defs: Partial<Integration> = {}) {
    assign(this, defs);
  }

}

@persistence()
export class ResourceType {

  @persist()
  title: string;

  @persist()
  hourRate: number;

  constructor(defs: Partial<ResourceType> = {}) {
    assign(this, defs);
  }

}

@persistence()
export class Scheme {

  @persist()
  version: number;

  constructor(defs: Partial<Scheme> = {}) {
    assign(this, defs);
  }

}

@persistence()
export class Spec extends Persistence {

  @persist()
  scheme: Scheme = new Scheme({
    version: 1
  });

  @persist()
  author: string;

  @persist()
  description: string;

  @persist({type: StoryEntry})
  integration: Integration = new Integration();

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
