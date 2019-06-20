import {Component, Input} from '@angular/core';
import {Issue} from '../../../model/planning/issue';
import {UI} from 'junte-ui';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {deserialize, Field, Model} from 'serialize-ts';
import {IssueLabel, IssueState} from "../../../enums/issue";

@Model()
class IssueStatus {

    @Field()
    title: string;

    @Field()
    state: IssueState;
}

@Component({
    selector: 'app-issue',
    templateUrl: './issue.component.html',
    styleUrls: ['./issue.component.scss']
})
export class IssueComponent {

    private _issue: Issue;

    ui = UI;
    issueLabel = IssueLabel;
    issueState = IssueState;

    status: IssueStatus;

    @Input() set issue(issue: Issue) {
        this._issue = issue;
        this.loadState();
    }

    get issue() {
        return this._issue;
    }

    constructor(private route: ActivatedRoute,
                private http: HttpClient) {
    }

    goto(url: string) {
        open(url);
    }

    loadState() {
        this.http.get('https://teamprojector.com/api/gitlab/issue/status?url='
            + this.issue.link)
            .pipe(map(status => deserialize(status, IssueStatus)))
            .subscribe(status => this.status = status);
    }

}
