import {Token} from './token';
import {Issue} from './issue';
import {ArraySerializer, ModelSerializer} from 'serialize-ts';
import {Feature} from './feature';
import {TokenSerializer} from '../serializers/token';
import {persist, persistence} from '../../decorators/persistence';

@persistence()
export class Improvement {

    @persist({serializer: new ArraySerializer(new TokenSerializer())})
    title: Token[] = [];

    @persist()
    feature: Feature;

    @persist({serializer: new ArraySerializer(new ModelSerializer(Issue))})
    issues: Issue[] = [];

    constructor(defs: any = {}) {
        Object.assign(this, defs);
    }
}
