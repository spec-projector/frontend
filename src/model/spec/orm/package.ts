import { persist, persistence, Persistence } from 'src/decorators/persistence';
import { Spec } from '../spec';
import { Entity } from './entity';

@persistence()
export class Package extends Persistence {

    @persist()
    name: string;

    @persist()
    title: string;

    @persist()
    autoName: boolean = true;

    @persist({type: Entity})
    entities: Entity[] = [];

    spec: Spec;

    constructor(defs: any = {}) {
        super();
        Object.assign(this, defs);
    }

    linking(spec: Spec) {
        this.spec = spec;
        for (const entity of this.entities) {
            entity.linking(this);
        }
    }
}
