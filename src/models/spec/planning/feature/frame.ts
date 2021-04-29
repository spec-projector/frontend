import { persist, persistence } from 'src/decorators/persistence';

@persistence()
export class Frame {

  @persist()
  id: string;

  @persist()
  url: string;

  @persist()
  thumbnail: string;

  constructor(defs: Partial<Frame> = {}) {
    Object.assign(this, defs);
  }

}
