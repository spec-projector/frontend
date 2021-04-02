import { persist, persistence } from 'src/decorators/persistence';
import { TokenSerializer } from 'src/models/spec/serializers/token';
import { ArraySerializer, ModelSerializer } from 'serialize-ts';
import { Spec } from '../spec';
import { Token } from './token';

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

    linking(spec: Spec) {

    }

    validate(spec: Spec) {

    }
}
