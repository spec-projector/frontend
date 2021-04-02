import { persist, persistence } from 'src/decorators/persistence';
import { Spec } from '../spec';
import { Entity } from './entity';
import { Enum } from './enum';

export enum FieldType {
  boolean = 'boolean',
  number = 'number',
  string = 'string',
  date = 'date',
  reference = 'reference',
  enum = 'enum',
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
  isArray: boolean = false;

  @persist()
  type: FieldType = FieldType.string;

  @persist()
  required: boolean = false;

  @persist()
  reference: string;

  @persist()
  enum: string;

  spec: Spec;
  entity: Entity;
  links: { reference?: Entity, enum?: Enum } = {};

  constructor(defs: any = {}) {
    Object.assign(this, defs);
  }

  linking(entity: Entity = null) {
    if (!!entity) {
      this.entity = entity;
    }

    if (!!this.entity) {
      switch (this.type) {
        case FieldType.reference:
          const entities = this.entity.package.spec.packages
            .reduce((arr, pack) => arr.concat(pack.entities), []);
          this.links.reference = entities
            .find(e => e.id === this.reference);
          break;
        case FieldType.enum:
          const enums = this.entity.package.spec.packages
            .reduce((arr, pack) => arr.concat(pack.enums), []);
          this.links.enum = enums
            .find(e => e.id === this.enum);
          break;
      }
    }
  }

}
