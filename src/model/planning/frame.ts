import { persist, persistence } from 'src/decorators/persistence';

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
