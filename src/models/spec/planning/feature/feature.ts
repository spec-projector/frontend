import * as assign from 'assign-deep';
import { ArraySerializer } from 'serialize-ts';
import { persist, persistence, Persistence } from 'src/decorators/persistence';
import { Sprint } from 'src/models/spec/planning/sprint';
import { Spec } from 'src/models/spec/spec';
import { TokenSerializer } from 'src/serializers/token';
import { Depends } from '../../../../types/depends';
import { ModelType } from '../../../enums';
import { Actor } from '../actor';
import { Module } from '../module';
import { Term } from '../term';
import { TermToken, Token } from '../token';
import { FeatureApi } from './api';
import { Frame } from './frame';
import { Issue } from './issue';
import { Resource } from './resource';
import { StoryEntry } from './story';
import { FeatureWorkflow } from './workflow';

function normalize(input: string) {
  return input.replace(/[аеиоуэыюя]/gi, '')
    .toLowerCase();
}

@persistence()
export class Feature extends Persistence {

  @persist({name: 'model_type'})
  modelType: string = ModelType.feature;

  @persist({serializer: new ArraySerializer(new TokenSerializer())})
  title: Token[] = [];

  @persist({type: StoryEntry})
  story: StoryEntry[] = [];

  @persist({type: Issue})
  issues: Issue[] = [];

  @persist({type: Frame})
  frames: Frame[] = [];

  @persist({type: FeatureApi})
  api: FeatureApi = new FeatureApi();

  @persist({type: Resource})
  resources: Resource[] = [];

  @persist()
  workflow: FeatureWorkflow = new FeatureWorkflow();

  @persist()
  sort: number;

  spec: Spec;
  actor: Actor;
  module: Module;
  sprint: Sprint;

  constructor(defs: Partial<Feature> = {}) {
    super();
    assign(this, defs);
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

    this.frames.forEach(f => f.linking(this));
    this.api.linking(this);
  }

  delete(): Depends {
    const links = {changed: [], deleted: [this, this.workflow, this.api]};
    if (!!this.actor) {
      this.actor.removeFeature(this);
      links.changed.push(this.actor);
    }

    if (!!this.module) {
      this.module.removeFeature(this);
      links.changed.push(this.module);
    }

    if (!!this.sprint) {
      this.sprint.removeFeature(this);
      links.changed.push(this.sprint);
    }

    return links;
  }

  private findTerms(tokens: Token[]) {
    return tokens.filter(t => t instanceof TermToken)
      .map((t1: TermToken) => this.spec.terms
        .find(t2 => normalize(t2.title) === normalize(t1.term)))
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

  new(): Persistence[] {
    super.new();
    let sort = this.actor.features.length > 0
      ? Math.max.apply(null, this.actor.features.map(e => e.sort))
      : 0;
    this.sort = ++sort;

    const api = new FeatureApi();
    api.new();
    this.api = api;

    const workflow = new FeatureWorkflow();
    workflow.new();
    this.workflow = workflow;

    return [api, workflow];
  }

  addFrame(frame: Frame) {
    this.frames.push(frame);
  }

  removeFrame(frame: Frame) {
    const index = this.frames.indexOf(frame);
    this.frames.splice(index, 1);
  }

}
