import { Group } from 'projects/game/src/models/group';
import { persist, persistence, Persistence } from 'src/decorators/persistence';

@persistence()
export class Kanban extends Persistence {

    @persist({type: Group})
    groups: Group[] = [];

    constructor(defs: any = {}) {
        super();
        Object.assign(this, defs);
    }

    linking() {
        for (const group of this.groups) {
            if (group instanceof Group) {
                group.linking(this);
            }
        }
    }
}
