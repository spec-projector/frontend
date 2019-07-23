import { persist, persistence, Persistence } from 'src/decorators/persistence';
import { EntityField } from './entity-field';
import { Package } from './package';

@persistence()
export class Entity extends Persistence {

    @persist()
    title: string;

    @persist()
    autoName: boolean = true;

    @persist()
    name: string;

    @persist({type: EntityField})
    fields: EntityField[] = [];

    package: Package;

    constructor(defs: any = {}) {
        super();
        Object.assign(this, defs);
    }

    linking(pack: Package) {
        this.package = pack;
        for (const entity of this.fields) {
            entity.linking(this);
        }
    }
}
