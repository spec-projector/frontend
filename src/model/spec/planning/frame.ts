import { persist, persistence } from 'src/decorators/persistence';

@persistence()
export class Frame {

  @persist()
  id: string;

  @persist()
  file: string;

  @persist()
  node: string;

  @persist()
  thumbnail: string;

  constructor(defs: any = {}) {
    Object.assign(this, defs);
  }
}
