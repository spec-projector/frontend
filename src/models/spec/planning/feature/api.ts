import { persist, Persistence, persistence } from '../../../../decorators/persistence';
import { ModelType } from '../../../enums';
import { Feature } from './feature';
import { GraphQL } from './graphql';
import * as assign from 'assign-deep';

@persistence()
export class FeatureApi extends Persistence {

  @persist({name: 'model_type'})
  modelType: string = ModelType.featureApi;

  @persist({type: GraphQL})
  graphql: GraphQL[] = [];

  feature: Feature;

  addGraphql(graphql: GraphQL) {
    this.graphql.push(graphql);
  }

  removeGraphql(graphql: GraphQL) {
    const index = this.graphql.indexOf(graphql);
    this.graphql.splice(index, 1);
  }

  constructor(defs: Partial<FeatureApi> = {}) {
    super();
    assign(this, defs);
  }

  linking(feature: Feature) {
    this.feature = feature;
  }

}
