import { persist, Persistence, persistence } from 'src/decorators/persistence';
import { Depends } from '../../../types/depends';
import { ModelType } from '../../enums';
import { Spec } from '../spec';
import { Entity } from './entity';
import { Enum } from './enum';
import * as assign from 'assign-deep';

export enum FieldType {
  boolean = 'boolean',
  number = 'number',
  string = 'string',
  date = 'date',
  reference = 'reference',
  enum = 'enum'
}

@persistence()
export class EntityField extends Persistence {

  @persist({name: 'model_type'})
  modelType: string = ModelType.entityField;

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

  constructor(defs: Partial<EntityField> = {}) {
    super();
    assign(this, defs);
  }

  linking({spec, entity}: { spec?: Spec, entity?: Entity } = {}) {
    if (spec !== undefined) {
      this.spec = spec;
    }
    if (entity !== undefined) {
      this.entity = entity;
    }

    if (!!this.spec) {
      switch (this.type) {
        case FieldType.reference:
          this.links.reference = this.spec.model.entities
            .find(e => e.id === this.reference);
          break;
        case FieldType.enum:
          this.links.enum = this.spec.model.enums
            .find(e => e.id === this.enum);
          break;
      }
    }
  }

  delete(): Depends {
    const links = {changed: [], deleted: [this]};

    this.entity.removeField(this);
    links.changed.push(this.entity);

    return links;
  }

}
