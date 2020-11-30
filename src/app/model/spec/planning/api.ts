import { persist, persistence } from 'src/decorators/persistence';

@persistence()
export class Api {

  @persist()
  id: string;

  @persist()
  title: string;

  @persist()
  url: string;

  constructor(defs: any = {}) {
    Object.assign(this, defs);
  }
}
