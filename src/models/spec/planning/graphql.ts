import { persist, persistence } from 'src/decorators/persistence';

@persistence()
export class Graphql {

  @persist()
  id: string;

  @persist()
  title: string;

  @persist()
  text: string;

  constructor(defs: Partial<Graphql> = {}) {
    Object.assign(this, defs);
  }

}
