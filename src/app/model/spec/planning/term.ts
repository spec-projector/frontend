import { Spec } from 'src/app/model/spec/spec';
import { persist, persistence, Persistence } from 'src/decorators/persistence';
import { TokenSerializer } from 'src/app/model/spec/serializers/token';
import { ArraySerializer } from 'serialize-ts';
import { Token } from './token';

@persistence()
export class Term extends Persistence {

    @persist()
    name: string;

    @persist({serializer: new ArraySerializer(new TokenSerializer())})
    description: Token[];

    spec: Spec;

    constructor(defs: any = {}) {
        super();
        Object.assign(this, defs);
    }

    linking(spec: Spec) {
        // console.log('term linking', this.name);
        this.spec = spec;
    }
}
