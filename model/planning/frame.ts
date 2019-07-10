import { persist, persistence } from 'decorators/persistence';

@persistence()
export class Frame {

    @persist()
    file: string;

    @persist()
    node: string;

    constructor(defs: any = {}) {
        Object.assign(this, defs);
    }
}
