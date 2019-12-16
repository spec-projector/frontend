import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PopoverService, UI } from 'junte-ui';
import { combineLatest, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Issue } from 'src/app/model/spec/planning/issue';
import { Spec } from 'src/app/model/spec/spec';
import { IssueGQL } from './issues.graphql';

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

    progress = {refreshing: false};

    constructor(private popover: PopoverService,
                private issueGQL: IssueGQL) {

    }

    add(issue: Issue) {
        this.issues.push(issue);
        this.changed.emit(this.issues);
        this.popover.hide();
        this.refresh();
    }

    delete(index: number) {
        this.issues.splice(index, 1);
        this.changed.emit(this.issues);
    }

    refresh(force = false) {
        const gitLabKey = this.spec.integration.gitLabKey;
        if (!gitLabKey) {
            return;
        }

        const queue = [];
        for (const issue of this.issues) {
            if (force || !issue.title) {
                queue.push(new Observable<Issue>(o => {
                    this.issueGQL.fetch({url: issue.url, token: gitLabKey, system: 'GITLAB'})
                        .subscribe(({data: {issue: {title, state}}}) => {
                            [issue.title, issue.state] = [title, state];
                            o.next(issue);
                            o.complete();
                        }, err => {
                            o.error(err);
                            o.complete();
                        });
                }));
            }
        }

        this.progress.refreshing = true;
        combineLatest(queue)
            .pipe(finalize(() => this.progress.refreshing = false))
            .subscribe(() => this.changed.emit(this.issues));
    }
}
