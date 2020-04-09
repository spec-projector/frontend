import { persist, persistence } from 'src/decorators/persistence';
import { Spec } from '../spec';
import { Entity } from './entity';

export enum FieldType {
  boolean = 'boolean',
  number = 'number',
  string = 'string',
  date = 'date',
  reference = 'reference',
  array = 'array'
}

@persistence()
export class EntityField {

  @persist()
  name: string;

  @persist()
  title: string;

  @persist()
  autoName: boolean = true;

  @persist()
  type: FieldType = FieldType.string;

  @persist()
  required: boolean = false;

  @persist()
  reference: string;

  @persist()
  required: boolean;

  spec: Spec;
  entity: Entity;
  links: { reference?: Entity } = {};

  constructor(defs: any = {}) {
    Object.assign(this, defs);
  }

  linking(entity: Entity = null) {
    if (!!entity) {
      this.entity = entity;
    }

    if ((this.type === FieldType.reference || FieldType.array) && !!this.reference && !!this.entity) {
      const entities = this.entity.package.spec.packages
        .reduce((entities, pack) => entities.concat(pack.entities), []);
      this.links.reference = entities.find(e => e.id === this.reference);
    }
  }
}
