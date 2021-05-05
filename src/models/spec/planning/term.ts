import { ArraySerializer } from 'serialize-ts';
import { persist, persistence, Persistence } from 'src/decorators/persistence';
import { TokenSerializer } from 'src/serializers/token';
import { Spec } from 'src/models/spec/spec';
import { Depends } from '../../../types/depends';
import { ModelType } from '../../enums';
import { Token } from './token';

@persistence()
export class Term extends Persistence {

  @persist({name: 'model_type'})
  modelType: string = ModelType.term;

  @persist()
  title: string;

  @persist({serializer: new ArraySerializer(new TokenSerializer())})
  description: Token[];

  spec: Spec;

  constructor(defs: Partial<Term> = {}) {
    super();
    Object.assign(this, defs);
  }

  linking(spec: Spec) {
    this.spec = spec;
  }

  delete(): Depends {
    const links = {changed: [], deleted: []};

    const index = this.spec.terms.findIndex(f => f.id === this.id);
    this.spec.terms.splice(index, 1);
    links.changed.push(this.spec);

    return links;
  }

}
