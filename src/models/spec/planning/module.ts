import { persist, Persistence, persistence } from 'src/decorators/persistence';
import { Spec } from 'src/models/spec/spec';
import { Entity } from '../orm/entity';
import { Enum } from '../orm/enum';
import { Feature } from './feature';

@persistence()
export class ModuleModel extends Persistence {

  @persist({type: Entity})
  entities: Entity[] = [];

  @persist({type: Enum})
  enums: Enum[] = [];

  addEntity(entity: Entity) {
    this.entities.push(entity);
  }

  addEnum(enum_: Enum) {
    this.enums.push(enum_);
  }

  constructor(defs: Partial<ModuleModel> = {}) {
    super();
    Object.assign(this, defs);
  }
}

@persistence()
export class Module extends Persistence {

  @persist()
  title: string;

  @persist({type: Feature})
  features: Feature[] = [];

  @persist()
  model: ModuleModel = new ModuleModel();

  spec: Spec;

  constructor(defs: Partial<Module> = {}) {
    super();
    Object.assign(this, defs);
  }

  linking(spec: Spec) {
    this.spec = spec;
    for (let i = 0; i < this.features.length; i++) {
      const feature = this.features[i];
      const found = spec.features.find(e => e.id === feature.id);
      if (!!found) {
        found.linking({module: this});
        this.features[i] = found;
      }
    }

    for (let i = 0; i < this.model.entities.length; i++) {
      const entity = this.model.entities[i];
      const found = spec.model.entities.find(e => e.id === entity.id);
      if (!!found) {
        found.linking({module: this});
        this.model.entities[i] = found;
      }
    }

    for (let i = 0; i < this.model.enums.length; i++) {
      const enum_ = this.model.enums[i];
      const found = spec.model.enums.find(e => e.id === enum_.id);
      if (!!found) {
        found.linking({module: this});
        this.model.enums[i] = found;
      }
    }
  }

  delete(): { changed: Persistence[], deleted: Persistence[] } {
    const links = {changed: [], deleted: []};

    this.features.forEach(f => f.module = null);
    this.model.entities.forEach(e => e.module = null);
    this.model.enums.forEach(e => e.module = null);

    const index = this.spec.modules.findIndex(f => f.id === this.id);
    this.spec.modules.splice(index, 1);
    links.changed.push(this.spec);

    return links;
  }

  addFeature(feature: Feature) {
    this.features.push(feature);
  }

}
