import { persist, persistence, Persistence } from 'decorators/persistence';
import { Space } from '../space';
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

    space: Space;

    constructor(defs: any = {}) {
        super();
        Object.assign(this, defs);
    }

    linking(space: Space) {
        this.space = space;
        for (const entity of this.entities) {
            entity.linking(this);
        }
    }
}
