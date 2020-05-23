import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PopoverService, UI } from 'junte-ui';
import { NGXLogger } from 'ngx-logger';
import { combineLatest, Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { deserialize } from 'serialize-ts/dist';
import { Issue } from 'src/app/model/spec/planning/issue';
import { SpecManager } from '../../../../managers/spec.manager';
import { IssueState } from '../../../../model/enums/issue';
import { Feature } from '../../../../model/spec/planning/feature';
import { IssueGQL } from './issues.graphql';

@Component({
  selector: 'spec-issues',
  templateUrl: './feature-issues.component.html',
  styleUrls: ['./feature-issues.component.scss']
})
export class FeatureIssuesComponent implements OnInit {

  ui = UI;
  issueState = IssueState;

  feature: Feature;

  progress = {refreshing: false};

  constructor(public manager: SpecManager,
              private popover: PopoverService,
              private issueGQL: IssueGQL,
              private route: ActivatedRoute,
              private logger: NGXLogger) {

  }

  ngOnInit() {
    this.route.data.subscribe(({feature}) => this.feature = feature);
  }

  add(issue: Issue) {
    this.feature.issues.push(issue);
    this.save();
    this.popover.hide();
    this.refresh();
  }

  delete(index: number) {
    this.feature.issues.splice(index, 1);
    this.save();
  }

  refresh(force = false) {
    const gitLabKey = this.feature.spec.integration.gitLabKey;
    if (!gitLabKey) {
      return;
    }

    const queue = [];
    for (const issue of this.feature.issues) {
      if (force || !issue.title) {
        queue.push(new Observable<Issue>(o => {
          this.issueGQL.fetch({url: issue.url, token: gitLabKey, system: 'GITLAB'})
            .pipe(map(({data: {issue: i}}) => deserialize(i, Issue)))
            .subscribe(i => {
              Object.assign(issue, i);
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
      .subscribe(() => this.save());
  }

  save() {
    this.logger.log('save issues for feature [', this.feature.title.toString(), ']');
    this.manager.put(this.feature);

    this.feature.version++;
  }
}
