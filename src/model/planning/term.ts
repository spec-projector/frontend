import { persist, persistence, Persistence } from 'src/decorators/persistence';
import { TokenSerializer } from 'src/model/serializers/token';
import { ArraySerializer } from 'serialize-ts';
import { Token } from './token';

@persistence()
export class Term extends Persistence {

    @persist()
    name: string;

    @persist({serializer: new ArraySerializer(new TokenSerializer())})
    description: Token[];

    constructor(defs: any = {}) {
        super();
        Object.assign(this, defs);
    }
}
