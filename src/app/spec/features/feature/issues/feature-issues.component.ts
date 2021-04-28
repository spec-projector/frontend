import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PopoverInstance, PopoverService, UI } from '@junte/ui';
import { NGXLogger } from 'ngx-logger';
import { combineLatest, Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { deserialize, serialize } from 'serialize-ts';
import { Language } from 'src/enums/language';
import { Issue } from 'src/models/spec/planning/issue';
import { SpecManager } from '../../../managers';
import { IssueState, IssueSystem } from '../../../../../enums/issue';
import { UploadFigmaAssetRequest } from '../../../../../models/figma-asset';
import { IssueDataRequest } from '../../../../../models/issue-data';
import { Project } from '../../../../../models/projects';
import { Feature } from '../../../../../models/spec/planning/feature';
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
  project: Project;

  constructor(@Inject(LOCALE_ID) public locale: string,
              public manager: SpecManager,
              private popover: PopoverService,
              private issueGQL: IssueGQL,
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
    this.feature.issues.push(issue);
    this.save();
    this.refresh();
  }

  delete(index: number) {
    this.feature.issues.splice(index, 1);
    this.save();
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
