import { persist, persistence, Persistence } from 'src/decorators/persistence';
import { Spec } from '../spec';
import { Entity } from './entity';
import { Enum } from './enum';

@persistence()
export class Package extends Persistence {

  @persist()
  name: string;

  @persist()
  title: string;

  @persist()
  autoName: boolean = true;

  @persist({type: Entity})
  entities: Entity[] = [];

  @persist({type: Enum})
  enums: Enum[] = [];

  spec: Spec;

  constructor(defs: any = {}) {
    super();
    Object.assign(this, defs);
  }

  linking(spec: Spec) {
    this.spec = spec;
    for (const e of this.entities) {
      e.linking(this);
    }

    for (const e of this.enums) {
      e.linking(this);
    }
  }

}
