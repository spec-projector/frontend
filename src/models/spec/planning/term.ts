import { ArraySerializer } from 'serialize-ts';
import { persist, persistence, Persistence } from 'src/decorators/persistence';
import { TokenSerializer } from 'src/models/spec/serializers/token';
import { Spec } from 'src/models/spec/spec';
import { Token } from './token';

@persistence()
export class Term extends Persistence {

    @persist()
    name: string;

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

  delete(): { changed: Persistence[], deleted: Persistence[] } {
    const links = {changed: [], deleted: []};

    const index = this.spec.terms.findIndex(f => f.id === this.id);
    this.spec.terms.splice(index, 1);
    links.changed.push(this.spec);

    return links;
  }

}
