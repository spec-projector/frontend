import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UI } from 'junte-ui';
import { Issue } from 'src/app/model/spec/planning/issue';
import { Spec } from 'src/app/model/spec/spec';

@Component({
    selector: 'spec-issues',
    templateUrl: './issues.component.html',
    styleUrls: ['./issues.component.scss']
})
export class IssuesComponent {

    ui = UI;

    @Input()
    spec: Spec;

    @Input()
    issues: Issue[] = [];

    @Output()
    changed = new EventEmitter<Issue[]>();

    add(issue: Issue) {
        this.issues.push(issue);
        this.changed.emit(this.issues);
    }

    update(index: number, issue: Issue) {
        this.issues[index] = issue;
        this.changed.emit(this.issues);
    }

}
