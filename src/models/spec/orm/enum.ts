import { persist, persistence, Persistence } from 'src/decorators/persistence';
import { Module } from '../planning/module';
import { Spec } from '../spec';

@persistence()
export class EnumOption extends Persistence {

  @persist()
  title: string;

  @persist()
  name: string;

  @persist()
  autoName: boolean = true;

  enum: Enum;

  linking(enum_: Enum) {
    if (!!enum_) {
      this.enum = enum_;
    }
  }

  delete(): { changed: Persistence[], deleted: Persistence[] } {
    const links = {changed: [], deleted: []};

    const index = this.enum.options.findIndex(f => f.id === this.id);
    this.enum.options.splice(index, 1);
    links.changed.push(this.enum);

    return links;
  }

  constructor(defs: Partial<EnumOption> = {}) {
    super();
    Object.assign(this, defs);
  }
}

@persistence()
export class Enum extends Persistence {

  @persist()
  id: string;

  @persist()
  title: string;

  @persist()
  autoName: boolean = true;

  @persist()
  name: string;

  @persist({type: EnumOption})
  options: EnumOption[] = [];

  spec: Spec;
  module: Module;

  constructor(defs: Partial<Enum> = {}) {
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

    for (const o of this.options) {
      o.linking(this);
    }
  }

  delete(): { changed: Persistence[], deleted: Persistence[] } {
    const links = {changed: [], deleted: []};

    if (!!this.module) {
      const index = this.module.model.enums.findIndex(f => f.id === this.id);
      this.module.model.enums.splice(index, 1);
      links.changed.push(this.module.model);
    }

    const index = this.spec.model.enums.findIndex(f => f.id === this.id);
    this.spec.model.enums.splice(index, 1);
    links.changed.push(this.spec.model);

    return links;
  }

}
