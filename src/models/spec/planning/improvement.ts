import { ArraySerializer, ModelSerializer } from 'serialize-ts';
import { persist, persistence } from 'src/decorators/persistence';
import { TokenSerializer } from 'src/models/spec/serializers/token';
import { Feature } from './feature';
import { Issue } from './issue';
import { Token } from './token';

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
