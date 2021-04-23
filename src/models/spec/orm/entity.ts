import { persist, persistence, Persistence } from 'src/decorators/persistence';
import { Module } from '../planning/module';
import { Spec } from '../spec';
import { EntityField } from './entity-field';

@persistence()
export class Entity extends Persistence {

  @persist()
  id: string;

  @persist()
  title: string;

  @persist()
  autoName: boolean = true;

  @persist()
  name: string;

  @persist({type: EntityField})
  fields: EntityField[] = [];

  spec: Spec;
  module: Module;

  constructor(defs: Partial<Entity> = {}) {
    super();
    Object.assign(this, defs);
  }

  linking({spec, module}: { spec?: Spec, module?: Module }) {
    if (spec !== undefined) {
      this.spec = spec;
    }

    if (module !== undefined) {
      this.module = module;
    }

    for (const f of this.fields) {
      f.linking(this);
    }
  }

  delete(): { changed: Persistence[], deleted: Persistence[] } {
    const links = {changed: [], deleted: []};

    if (!!this.module) {
      const index = this.module.model.entities.findIndex(f => f.id === this.id);
      this.module.model.entities.splice(index, 1);
      links.changed.push(this.module.model);
    }

    const index = this.spec.model.entities.findIndex(f => f.id === this.id);
    this.spec.model.entities.splice(index, 1);
    links.changed.push(this.spec.model);

    return links;
  }

}
