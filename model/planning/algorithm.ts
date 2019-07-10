import {Token} from './token';
import {ArraySerializer, ModelSerializer} from 'serialize-ts';
import {Space} from '../space';
import {TokenSerializer} from 'model/serializers/token';
import {persist, persistence} from 'decorators/persistence';

@persistence()
export class AlgorithmStep {

    @persist({serializer: new ArraySerializer(new TokenSerializer())})
    can: Token[];

    @persist({serializer: new ArraySerializer(new TokenSerializer())})
    see: Token[];

    constructor(defs: any = {}) {
        Object.assign(this, defs);
    }
}

@persistence()
export class Algorithm {

    @persist()
    id: string;

    @persist({serializer: new ArraySerializer(new TokenSerializer())})
    title: Token[] = [];

    @persist({serializer: new ArraySerializer(new ModelSerializer(AlgorithmStep))})
    steps: AlgorithmStep[] = [];

    constructor(defs: any = {}) {
        Object.assign(this, defs);
    }

    linking(space: Space) {

    }

    validate(space: Space) {

    }
}
