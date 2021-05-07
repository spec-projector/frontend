import { EventEmitter } from '@angular/core';
import { persist, persistence, Persistence } from 'src/decorators/persistence';
import { Depends } from '../../../types/depends';
import { ModelType } from '../../enums';
import { Spec } from '../spec';
import { Feature } from './feature/feature';
import * as assign from 'assign-deep';

@persistence()
export class Actor extends Persistence {

  @persist({name: 'model_type'})
  modelType: string = ModelType.actor;

  @persist()
  name: string;

  @persist({type: Feature})
  features: Feature[] = [];

  spec: Spec;

  _version = 0;
  kicked = new EventEmitter();

  set version(version: number) {
    this._version = version;
    this.spec.version++;
  }

  get version() {
    return this._version;
  }

  constructor(defs: Partial<Actor> = {}) {
    super();
    assign(this, defs);
  }

  linking(spec: Spec) {
    this.spec = spec;
    for (const feature of this.features) {
      feature.linking({spec: spec, actor: this});
    }
  }

  delete(): Depends {
    const links = {changed: [], deleted: []};

    this.features.reduce((r, f) => r.concat(f.delete()), [])
      .forEach(l => [links.changed, links.deleted] =
        [links.changed.concat(l.changed), links.deleted.concat(l.deleted)]);

    const index = this.spec.actors.findIndex(f => f.id === this.id);
    this.spec.actors.splice(index, 1);
    links.changed.push(this.spec);

    return links;
  }

  addFeature(feature: Feature) {
    this.features.push(feature);
  }

  removeFeature(feature: Feature) {
    const index = this.features.indexOf(feature);
    this.features.splice(index, 1);
  }

  kick() {
    this.kicked.next();
  }

}
