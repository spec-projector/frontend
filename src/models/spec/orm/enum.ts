import { persist, persistence, Persistence } from 'src/decorators/persistence';
import { Depends } from '../../../types/depends';
import { ModelType } from '../../enums';
import { Module } from '../planning/module';
import { Spec } from '../spec';
import { EntityField } from './entity-field';
import { EnumOption } from './enum-option';

@persistence()
export class Enum extends Persistence {

  @persist({name: 'model_type'})
  modelType: string = ModelType.enum;

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

  @persist()
  sort: number;

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

  new() {
    super.new();
    let sort = this.spec.model.enums.length > 0
      ? Math.max.apply(null, this.spec.model.enums.map(e => e.sort))
      : 0;
    this.sort = ++sort;
  }

  delete(): Depends {
    const links = {changed: [], deleted: []};

    if (!!this.module) {
      this.module.model.removeEnum(this);
      links.changed.push(this.module.model);
    }

    this.spec.model.removeEnum(this);
    links.changed.push(this.spec.model);

    return links;
  }

  addOption(option: EnumOption) {
    this.options.push(option);
  }

  removeOption(option: EnumOption) {
    const index = this.options.indexOf(option);
    this.options.splice(index, 1);
  }

}
