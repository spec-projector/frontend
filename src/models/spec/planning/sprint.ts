import { ArraySerializer, ModelSerializer } from 'serialize-ts';
import { persist, Persistence, persistence } from 'src/decorators/persistence';
import { Spec } from '../spec';
import { Feature } from './feature';
import { Improvement } from './improvement';

@persistence()
export class Sprint extends Persistence {

  @persist()
  id: string;

  @persist()
  title: string;

  @persist({serializer: new ArraySerializer(new ModelSerializer(Feature))})
  features: Feature[] = [];

  @persist({serializer: new ArraySerializer(new ModelSerializer(Improvement))})
  improvements: Improvement[] = [];

  spec: Spec;

  constructor(defs: any = {}) {
    super();
    Object.assign(this, defs);
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

  delete(): { changed: Persistence[], deleted: Persistence[] } {
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

}
