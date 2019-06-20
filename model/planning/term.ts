import {ArraySerializer} from 'serialize-ts';
import {Token} from './token';
import {TokenSerializer} from '../serializers/token';
import {persist, persistence, Persistence} from '../../decorators/persistence';

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
