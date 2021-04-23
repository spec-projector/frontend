import * as assign from 'assign-deep';
import { persist, persistence, Persistence } from 'src/decorators/persistence';
import { Feature, StoryEntry } from 'src/models/spec/planning/feature';
import { ValidationError } from 'src/models/validation/error';
import { Entity } from './orm/entity';
import { Enum } from './orm/enum';
import { Actor } from './planning/actor';
import { Module } from './planning/module';
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
export class Model extends Persistence {

  @persist({type: Entity})
  entities: Entity[] = [];

  @persist({type: Enum})
  enums: Enum[] = [];

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

  @persist({name: 'epics', type: Module})
  modules: Module[] = [];

  @persist({type: Sprint})
  sprints: Sprint[] = [];

  @persist({type: Term})
  terms: Term[] = [];

  @persist({type: Model})
  model: Model = new Model();

  version = 0;

  constructor(defs: Partial<Spec> = {}) {
    super();
    Object.assign(this, defs);
  }

  get features(): Feature[] {
    return this.actors.reduce((res, a) => res.concat(a.features), []);
  }

  linking() {
    console.log('spec linking');
    for (const actor of this.actors) {
      actor.linking(this);
    }


    for (const entity of this.model.entities) {
      entity.linking({spec: this});
    }

    for (const enum_ of this.model.enums) {
      enum_.linking({spec: this});
    }

    for (const epic of this.modules) {
      epic.linking(this);
    }

    for (const sprint of this.sprints) {
      sprint.linking(this);
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

    for (const epic of this.modules) {
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
