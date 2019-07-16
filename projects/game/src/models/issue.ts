import { Group } from 'projects/game/src/models/group';
import { persist, persistence, Persistence } from 'src/decorators/persistence';

@persistence()
export class Issue extends Persistence {

    @persist()
    title: string;

    group: Group;

    constructor(defs: any = {}) {
        super();
        Object.assign(this, defs);
    }

    linking(group: Group = null) {
        if (!!group) {
            this.group = group;
        }
    }
}
