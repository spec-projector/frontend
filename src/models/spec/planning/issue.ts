import { IssueState, IssueSystem } from 'src/enums/issue';
import { persist, persistence } from 'src/decorators/persistence';

@persistence()
export class Developer {

    @persist()
    name: string;

    @persist()
    avatar: string;
}

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
    assignee: Developer;

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
