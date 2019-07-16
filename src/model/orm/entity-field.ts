import { persist, persistence } from 'src/decorators/persistence';
import { Space } from '../space';
import { Entity } from './entity';

export enum FieldType {
    number = 'number',
    string = 'string',
    date = 'date',
    reference = 'reference',
    array = 'array'
}

@persistence()
export class EntityField {

    @persist()
    name: string;

    @persist()
    title: string;

    @persist()
    autoName: boolean = true;

    @persist()
    type: FieldType = FieldType.string;

    @persist()
    reference: string;

    @persist()
    required: boolean;

    space: Space;
    entity: Entity;
    links: { reference?: Entity } = {};

    constructor(defs: any = {}) {
        Object.assign(this, defs);
    }

    linking(entity: Entity = null) {
        if (!!entity) {
            this.entity = entity;
        }

        if ((this.type === FieldType.reference || FieldType.array) && !!this.reference) {
            const entities = this.entity.package.space.packages.reduce((entities, pack) => entities.concat(pack.entities), []);
            this.links.reference = entities.find(e => e.id === this.reference);
        }
    }
}
