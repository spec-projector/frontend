import { persist, Persistence, persistence } from '../../../../decorators/persistence';
import { Graphql } from './graphql';

@persistence()
export class FeatureApi extends Persistence {

  @persist({type: Graphql})
  graphql: Graphql[] = [];

  addGraphql(graphql: Graphql) {
    this.graphql.push(graphql);
  }

  constructor(defs: Partial<FeatureApi> = {}) {
    super();
    Object.assign(this, defs);
  }

}
