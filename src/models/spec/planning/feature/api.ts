import { persist, Persistence, persistence } from '../../../../decorators/persistence';
import { ModelType } from '../../../enums';
import { Graphql } from './graphql';
import * as assign from 'assign-deep';

@persistence()
export class FeatureApi extends Persistence {

  @persist({name: 'model_type'})
  modelType: string = ModelType.featureApi;

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
    assign(this, defs);
  }

}
