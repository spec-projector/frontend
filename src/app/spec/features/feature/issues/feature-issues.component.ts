import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PopoverInstance, PopoverService, UI } from '@junte/ui';
import { NGXLogger } from 'ngx-logger';
import { combineLatest, Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { deserialize, serialize } from 'serialize-ts';
import { Language } from 'src/enums/language';
import { Issue } from 'src/models/spec/planning/feature/issue';
import { IssueState, IssueSystem } from '../../../../../enums/issue';
import { IssueDataRequest } from '../../../../../models/issue-data';
import { Project } from '../../../../../models/project';
import { Feature } from '../../../../../models/spec/planning/feature/feature';
import { SpecManager } from '../../../managers/spec';
import { IssueGQL } from './issues.graphql';

@Component({
  selector: 'spec-issues',
  templateUrl: './feature-issues.component.html',
  styleUrls: ['./feature-issues.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeatureIssuesComponent implements OnInit {

  ui = UI;
  issueState = IssueState;
  language = Language;
  i18n = {attachIssue: $localize`:@@label.attach_issue:Attach issue`};

  feature: Feature;

  progress = {refreshing: false};
  reference: { popover: PopoverInstance } = {popover: null};
  project: Project;

  constructor(@Inject(LOCALE_ID) public locale: string,
              public manager: SpecManager,
              private popover: PopoverService,
              private issueGQL: IssueGQL,
              private cd: ChangeDetectorRef,
              private route: ActivatedRoute,
              public router: Router,
              public logger: NGXLogger) {
  }

  ngOnInit() {
    this.route.data.subscribe(({project, feature}) =>
      [this.project, this.feature] = [project, feature]);
  }

  add(issue: Issue) {
    this.reference.popover?.hide();
    issue.new();
    this.manager.put(issue);

    this.feature.addIssue(issue);
    this.manager.put(this.feature);

    this.refresh();

    this.cd.markForCheck();
  }

  delete(issue: Issue) {
    this.feature.removeIssue(issue);
    this.manager.put(this.feature);

    this.cd.markForCheck();
  }

  refresh(force = false) {
    const queue = [];
    for (const issue of this.feature.issues) {
      if (force || !issue.title) {
        queue.push(new Observable<Issue>(o => {
          const request = new IssueDataRequest({
            project: this.project.id,
            url: issue.url,
            system: issue.system || IssueSystem.gitlab
          });
          this.issueGQL.fetch({input: serialize(request)})
            .pipe(map(({data: {issue: i}}) => deserialize(i, Issue)),
              finalize(() => {
                this.manager.put(issue);
                this.cd.markForCheck();

                o.next(issue);
                o.complete();
              }))
            .subscribe(i => {
                Object.assign(issue, i);
                issue.error = null;
              },
              err => issue.error = err.toString());
        }));
      }
    }

    this.progress.refreshing = true;
    this.cd.markForCheck();
    combineLatest(queue)
      .pipe(finalize(() => {
        this.progress.refreshing = false;
        this.cd.markForCheck();
      }))
      .subscribe(() => null);
  }

}
