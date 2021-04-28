import { ArraySerializer } from 'serialize-ts';
import { persist, persistence, Persistence } from 'src/decorators/persistence';
import { Graphql } from 'src/models/spec/planning/graphql';
import { Sprint } from 'src/models/spec/planning/sprint';
import { TokenSerializer } from 'src/serializers/token';
import { Spec } from 'src/models/spec/spec';
import { ModelType } from '../../enums';
import { Actor } from './actor';
import { Algorithm } from './algorithm';
import { Api } from './api';
import { Frame } from './frame';
import { Issue } from './issue';
import { Module } from './module';
import { Term } from './term';
import { TermToken, Token } from './token';

function normalize(input: string) {
  return input.replace(/[аеиоуэыюя]/gi, '')
    .toLowerCase();
}

export enum WorkflowStepState {
  doing = 'doing',
  done = 'done',
  missed = 'missed'
}

export enum StoryEntryType {
  see = 'see',
  can = 'can'
}

@persistence()
export class Workflow {

  @persist()
  story: WorkflowStepState = WorkflowStepState.doing;

  @persist()
  design: WorkflowStepState = WorkflowStepState.doing;

  @persist()
  resources: WorkflowStepState = WorkflowStepState.doing;

  @persist()
  api: WorkflowStepState = WorkflowStepState.doing;

  @persist()
  developing: WorkflowStepState = WorkflowStepState.doing;

  @persist()
  testing: WorkflowStepState = WorkflowStepState.doing;

  @persist()
  accepting: WorkflowStepState = WorkflowStepState.doing;

  constructor(defs: any = {}) {
    Object.assign(this, defs);
  }
}

@persistence()
export class Resource {

  @persist()
  resource: string;

  @persist()
  hours: number;

  constructor(defs: any = {}) {
    Object.assign(this, defs);
  }
}

@persistence()
export class StoryEntry {

  @persist()
  type: StoryEntryType;

  @persist({serializer: new ArraySerializer(new TokenSerializer())})
  description: Token[];

  constructor(defs: Partial<StoryEntry> = {}) {
    Object.assign(this, defs);
  }
}

@persistence()
export class Feature extends Persistence {

  @persist({name: 'model_type'})
  type: string = ModelType.feature;

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

  @persist({type: Graphql})
  graphql: Graphql[] = [];

  @persist({type: Algorithm})
  algorithms: Algorithm[] = [];

  @persist({type: Resource})
  resources: Resource[] = [];

  @persist()
  workflow: Workflow = new Workflow();

  @persist()
  sort: number;

  spec: Spec;
  actor: Actor;
  module: Module;
  sprint: Sprint;

  _version = 0;

  set version(version: number) {
    this._version = version;
    this.actor.version++;
  }

  get version() {
    return this._version;
  }

  constructor(defs: any = {}) {
    super();
    Object.assign(this, defs);
  }

  linking({spec, actor, module, sprint}: { spec?: Spec, actor?: Actor, module?: Module, sprint?: Sprint }) {
    if (spec !== undefined) {
      this.spec = spec;
    }
    if (actor !== undefined) {
      this.actor = actor;
    }

    if (module !== undefined) {
      this.module = module;
    }

    if (sprint !== undefined) {
      this.sprint = sprint;
    }
  }

  delete(): { changed: Persistence[], deleted: Persistence[] } {
    const links = {changed: [], deleted: []};
    if (!!this.actor) {
      const index = this.actor.features.findIndex(f => f.id === this.id);
      this.actor.features.splice(index, 1);
      links.changed.push(this.actor);
    }

    if (!!this.module) {
      const index = this.module.features.findIndex(f => f.id === this.id);
      this.module.features.splice(index, 1);
      links.changed.push(this.module);
    }

    if (!!this.sprint) {
      const index = this.sprint.features.findIndex(f => f.id === this.id);
      this.sprint.features.splice(index, 1);
      links.changed.push(this.sprint);
    }

    return links;
  }

  private findTerms(tokens: Token[]) {
    return tokens.filter(t => t instanceof TermToken)
      .map((t1: TermToken) => this.spec.terms
        .find(t2 => normalize(t2.name) === normalize(t1.term)))
      .filter(t => !!t);
  }

  getTerms() {
    if (!this.spec) {
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

  new() {
    super.new();
    let sort = this.actor.features.length > 0
      ? Math.max.apply(null, this.actor.features.map(e => e.sort))
      : 0;
    this.sort = ++sort;
  }

}
