import { persist, Persistence, persistence } from 'src/decorators/persistence';

@persistence()
export class Graphql extends Persistence {

  @persist()
  id: string;

  @persist()
  title: string;

  @persist()
  text: string;

  constructor(defs: Partial<Graphql> = {}) {
    super();
    Object.assign(this, defs);
  }

}
