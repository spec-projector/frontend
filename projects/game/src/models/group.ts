import { Issue } from 'projects/game/src/models/issue';
import { Kanban } from 'projects/game/src/models/kanban';
import { persist, persistence, Persistence } from 'src/decorators/persistence';

@persistence()
export class Group extends Persistence {

    private _title: string;

    @persist()
    get title() {
        return this._title;
    }

    set title(title: string) {
        this._title = title;

        if (!this.code) {
            this.code = this.title.toLowerCase().replace(' ', '_');
        }
    }

    @persist()
    code: string;

    @persist({type: Issue})
    issues: Issue[] = [];

    kanban: Kanban;

    constructor(defs: any = {}) {
        super();
        Object.assign(this, defs);
    }

    linking(kanban: Kanban) {
        this.kanban = kanban;
        for (const issue of this.issues) {
            issue.linking(this);
        }
    }
}
