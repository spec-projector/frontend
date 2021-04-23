import { persist, persistence, Persistence } from 'src/decorators/persistence';
import { ValidationError } from 'src/models/validation/error';
import { Spec } from '../spec';
import { Feature } from './feature';

@persistence()
export class Actor extends Persistence {

  @persist()
  name: string;

  @persist({type: Feature})
  features: Feature[] = [];

  spec: Spec;

  _version = 0;

  set version(version: number) {
    this._version = version;
    this.spec.version++;
  }

  get version() {
    return this._version;
  }

  constructor(defs: any = {}) {
    super();
    Object.assign(this, defs);
  }

  linking(spec: Spec) {
    this.spec = spec;
    for (const feature of this.features) {
      feature.linking({spec: spec, actor: this});
    }
  }

  delete(): { changed: Persistence[], deleted: Persistence[] } {
    const links = {changed: [], deleted: []};

    this.features.reduce((r, f) => r.concat(f.delete()), [])
      .forEach(l => [links.changed, links.deleted] =
        [links.changed.concat(l.changed), links.deleted.concat(l.deleted)]);

    const index = this.spec.actors.findIndex(f => f.id === this.id);
    this.spec.actors.splice(index, 1);
    links.changed.push(this.spec);

    return links;
  }

  validate(spec: Spec) {
    let errors: ValidationError[] = [];
    for (const feature of this.features) {
      const errs = feature.validate(spec);
      if (!!errs) {
        errs.forEach(e => e.actor = this);

        errors = errors.concat(errs);
      }
    }

    return errors;
  }
}
