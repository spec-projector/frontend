import { persist, Persistence, persistence } from '../../../../decorators/persistence';
import { Graphql } from './graphql';

@persistence()
export class FeatureApi extends Persistence {

  @persist({type: Graphql})
  graphql: Graphql[] = [];

  addGraphql(graphql: Graphql) {
    this.graphql.push(graphql);
  }

  removeGraphql(graphql: Graphql) {
    const index = this.graphql.indexOf(graphql);
    this.graphql.splice(index, 1);
  }

  constructor(defs: Partial<FeatureApi> = {}) {
    super();
    Object.assign(this, defs);
  }

}
