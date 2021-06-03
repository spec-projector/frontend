import { persist, persistence, Persistence } from 'src/decorators/persistence';
import { Depends } from '../../../types/depends';
import { ModelType } from '../../enums';
import { Module } from '../planning/module';
import { Spec } from '../spec';
import { EntityField } from './entity-field';
import * as assign from 'assign-deep';

@persistence()
export class Entity extends Persistence {

  @persist({name: 'model_type'})
  modelType: string = ModelType.entity;

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

  @persist()
  sort: number;

  spec: Spec;
  module: Module;

  constructor(defs: Partial<Entity> = {}) {
    super();
    assign(this, defs);
  }

  linking({spec, module}: { spec?: Spec, module?: Module }) {
    if (spec !== undefined) {
      this.spec = spec;
    }

    if (module !== undefined) {
      this.module = module;
    }

    for (const f of this.fields) {
      f.linking({spec: this.spec, entity: this});
    }
  }

  new() {
    super.new();
    let sort = this.spec.model.entities.length > 0
      ? Math.max.apply(null, this.spec.model.entities.map(e => e.sort))
      : 0;
    this.sort = ++sort;
  }

  delete(): Depends {
    const links = {changed: [], deleted: [this]};

    Array.from(this.fields).reduce((r, f) => r.concat(f.delete()), [])
      .forEach(l => [links.changed, links.deleted] =
        [links.changed.concat(l.changed), links.deleted.concat(l.deleted)]);

    if (!!this.module) {
      this.module.model.removeEntity(this);
      links.changed.push(this.module.model);
    }

    this.spec.model.removeEntity(this);
    links.changed.push(this.spec.model);

    return links;
  }

  addField(field: EntityField) {
    this.fields.push(field);
  }

  removeField(field: EntityField) {
    const index = this.fields.indexOf(field);
    this.fields.splice(index, 1);
  }

}
