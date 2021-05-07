import { persist, persistence } from '../../../../decorators/persistence';
import * as assign from 'assign-deep';

@persistence()
export class Resource {

  @persist()
  resource: string;

  @persist()
  hours: number;

  constructor(defs: Partial<Resource> = {}) {
    assign(this, defs);
  }

}
