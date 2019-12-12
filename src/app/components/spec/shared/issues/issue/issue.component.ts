import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UI } from 'junte-ui';
import { map } from 'rxjs/operators';
import { deserialize, Field, Model } from 'serialize-ts';
import { IssueState } from 'src/app/model/enums/issue';
import { Issue } from 'src/app/model/spec/planning/issue';

@Model()
class IssueStatus {

    @Field()
    title: string;

    @Field()
    state: IssueState;

}

@Component({
    selector: 'spec-issue',
    templateUrl: './issue.component.html',
    styleUrls: ['./issue.component.scss']
})
export class IssueComponent {

    private _issue: Issue;

    ui = UI;
    issueState = IssueState;

    status: IssueStatus;

    @Input() set issue(issue: Issue) {
        this._issue = issue;
        this.loadState();
    }

    get issue() {
        return this._issue;
    }

    @Output()
    updated = new EventEmitter<Issue>();

    constructor(private route: ActivatedRoute,
                private http: HttpClient) {
    }

    goto(url: string) {
        open(url);
    }

    loadState() {
        const request = 'https://teamprojector.com/api/gitlab/issue/status?url=' + this.issue.url;
        this.http.get(request)
            .pipe(map(status => deserialize(status, IssueStatus)))
            .subscribe(({title}) => {
                    [this.issue.title] = title;
                },
                err => this.issue.error = err);
    }

}
