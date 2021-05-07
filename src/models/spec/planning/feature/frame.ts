import { persist, Persistence, persistence } from 'src/decorators/persistence';
import { Depends } from '../../../../types/depends';
import { ModelType } from '../../../enums';
import * as assign from 'assign-deep';
import { Spec } from '../../spec';
import { ModuleModel } from '../module';
import { Feature } from './feature';

@persistence()
export class Frame extends Persistence {

  @persist({name: 'model_type'})
  modelType: string = ModelType.featureFrame;

  @persist()
  id: string;

  @persist()
  url: string;

  @persist()
  thumbnail: string;

  feature: Feature;

  constructor(defs: Partial<Frame> = {}) {
    super();
    assign(this, defs);
  }

  linking(feature: Feature) {
    this.feature = feature;
  }

  delete(): Depends {
    const links = {changed: [], deleted: []};

    this.feature.removeFrame(this);
    links.changed.push(this.feature);

    return links;
  }

}
