import { persist, persistence } from 'decorators/persistence';

@persistence()
export class Api {

    @persist()
    title: string;

    @persist()
    url: string;

    constructor(defs: any = {}) {
        Object.assign(this, defs);
    }
}
