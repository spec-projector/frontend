import { ArraySerializer } from 'serialize-ts';
import { persist, persistence, Persistence } from 'src/decorators/persistence';
import { Spec } from 'src/models/spec/spec';
import { TokenSerializer } from 'src/serializers/token';
import { Patch } from '../../../types/patch';
import { ModelType } from '../../enums';
import { Token } from './token';
import * as assign from 'assign-deep';

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
    assign(this, defs);
  }

  linking(spec: Spec) {
    this.spec = spec;
  }

  delete(): Patch {
    const links = {changed: [], deleted: [this]};

    const index = this.spec.terms.findIndex(f => f.id === this.id);
    this.spec.terms.splice(index, 1);
    links.changed.push(this.spec);
    this.spec.updated();

    return links;
  }

}
