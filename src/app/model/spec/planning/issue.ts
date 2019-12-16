import { IssueState, IssueSystem } from 'src/app/model/enums/issue';
import { persist, persistence } from 'src/decorators/persistence';

@persistence()
export class Issue {

    @persist()
    resource: string;

    @persist()
    url: string;

    @persist()
    system: IssueSystem;

    @persist()
    title: string;

    @persist()
    assignee: string;

    @persist()
    spent: number;

    @persist()
    error: string;

    @persist()
    state: IssueState;

    constructor(defs: any = {}) {
        Object.assign(this, defs);
    }
}
