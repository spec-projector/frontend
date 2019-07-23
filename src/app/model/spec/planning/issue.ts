import { persist, persistence } from 'src/decorators/persistence';

@persistence()
export class Issue {

    @persist()
    link: string;

    @persist()
    label: string;

    constructor(defs: any = {}) {
        Object.assign(this, defs);
    }
}
