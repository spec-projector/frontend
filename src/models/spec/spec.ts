import * as assign from 'assign-deep';
import { persist, persistence, Persistence } from 'src/decorators/persistence';
import { Feature, StoryEntry } from 'src/models/spec/planning/feature';
import { Entity } from './orm/entity';
import { Enum } from './orm/enum';
import { Actor } from './planning/actor';
import { Module } from './planning/module';
import { Sprint } from './planning/sprint';
import { Term } from './planning/term';

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
export class SpecModel extends Persistence {

  @persist({type: Entity})
  entities: Entity[] = [];

  @persist({type: Enum})
  enums: Enum[] = [];

  constructor(defs: Partial<SpecModel> = {}) {
    super();
    Object.assign(this, defs);
  }

  addEntity(entity: Entity) {
    this.entities.push(entity);
  }

  addEnum(enum_: Enum) {
    this.enums.push(enum_);
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

  @persist({type: Module})
  modules: Module[] = [];

  @persist({type: Sprint})
  sprints: Sprint[] = [];

  @persist({type: Term})
  terms: Term[] = [];

  @persist({type: SpecModel})
  model: SpecModel = new SpecModel();

  version = 0;

  constructor(defs: Partial<Spec> = {}) {
    super();
    Object.assign(this, defs);
  }

  get features(): Feature[] {
    return this.actors.reduce((res, a) => res.concat(a.features), []);
  }

  linking() {
    for (const actor of this.actors) {
      actor.linking(this);
    }

    for (const entity of this.model.entities) {
      entity.linking({spec: this});
    }

    for (const enum_ of this.model.enums) {
      enum_.linking({spec: this});
    }

    for (const module of this.modules) {
      module.linking(this);
    }

    for (const sprint of this.sprints) {
      sprint.linking(this);
    }

    for (const term of this.terms) {
      term.linking(this);
    }
  }

  addTerm(term: Term) {
    this.terms.push(term);
  }

}
