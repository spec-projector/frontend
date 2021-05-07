import { persist, Persistence, persistence } from 'src/decorators/persistence';
import { ModelType } from '../../../enums';
import * as assign from 'assign-deep';

@persistence()
export class Graphql extends Persistence {

  @persist({name: 'model_type'})
  modelType: string = ModelType.featureGraphql;

  @persist()
  id: string;

  @persist()
  title: string;

  @persist()
  text: string;

  constructor(defs: Partial<Graphql> = {}) {
    super();
    assign(this, defs);
  }

}
