import { persist, persistence } from '../../../../decorators/persistence';

@persistence()
export class Resource {

  @persist()
  resource: string;

  @persist()
  hours: number;

  constructor(defs: any = {}) {
    Object.assign(this, defs);
  }
}
