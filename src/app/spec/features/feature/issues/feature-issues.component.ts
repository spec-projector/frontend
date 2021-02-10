import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PopoverInstance, PopoverService, UI } from '@junte/ui';
import { NGXLogger } from 'ngx-logger';
import { combineLatest, Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { deserialize } from 'serialize-ts';
import { Language } from 'src/enums/language';
import { Issue } from 'src/model/spec/planning/issue';
import { SpecManager } from '../../../../../managers/spec.manager';
import { IssueState } from '../../../../../enums/issue';
import { Feature } from '../../../../../model/spec/planning/feature';
import { IssueGQL } from './issues.graphql';

@Component({
  selector: 'spec-issues',
  templateUrl: './feature-issues.component.html',
  styleUrls: ['./feature-issues.component.scss']
})
export class FeatureIssuesComponent implements OnInit {

  ui = UI;
  issueState = IssueState;
  language = Language;

  feature: Feature;

  progress = {refreshing: false};
  reference: { popover: PopoverInstance } = {popover: null};

  constructor(public manager: SpecManager,
              private popover: PopoverService,
              private issueGQL: IssueGQL,
              private route: ActivatedRoute,
              private logger: NGXLogger,
              @Inject(LOCALE_ID) public locale: string) {

  }

  ngOnInit() {
    this.route.data.subscribe(({feature}) => this.feature = feature);
  }

  add(issue: Issue) {
    this.reference.popover?.hide();
    this.feature.issues.push(issue);
    this.save();
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
