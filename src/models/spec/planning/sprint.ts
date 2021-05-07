import { ArraySerializer, ModelSerializer } from 'serialize-ts';
import { persist, Persistence, persistence } from 'src/decorators/persistence';
import { Depends } from '../../../types/depends';
import { ModelType } from '../../enums';
import { Spec } from '../spec';
import { Feature } from './feature/feature';
import * as assign from 'assign-deep';

@persistence()
export class Sprint extends Persistence {

  @persist({name: 'model_type'})
  modelType: string = ModelType.sprint;

  @persist()
  id: string;

  @persist()
  title: string;

  @persist({serializer: new ArraySerializer(new ModelSerializer(Feature))})
  features: Feature[] = [];

  spec: Spec;

  constructor(defs: Partial<Sprint> = {}) {
    super();
    assign(this, defs);
  }

  linking(spec: Spec) {
    this.spec = spec;

    for (let i = 0; i < this.features.length; i++) {
      const feature = this.features[i];
      const found = spec.features.find(e => e.id === feature.id);
      if (!!found) {
        found.linking({sprint: this});
        this.features[i] = found;
      }
    }
  }

  delete(): Depends {
    const links = {changed: [], deleted: []};

    this.features.forEach(f => f.sprint = null);

    const index = this.spec.sprints.findIndex(f => f.id === this.id);
    this.spec.sprints.splice(index, 1);
    links.changed.push(this.spec);

    return links;
  }

  addFeature(feature: Feature) {
    this.features.push(feature);
  }

  removeFeature(feature: Feature) {
    const index = this.features.indexOf(feature);
    this.features.splice(index, 1);
  }

}
