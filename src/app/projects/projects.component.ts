import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { deserialize } from 'serialize-ts';
import { PopoverInstance, UI } from '@junte/ui';
import { R } from 'apollo-angular/types';
import { delay, finalize, map } from 'rxjs/operators';
import { AllProjectsGQL, DeleteProjectGQL } from 'src/app/projects/projects.graphql';
import { PagingProjects, Project, ProjectsFilter } from 'src/model/projects';
import { UI_DELAY } from '../../consts';
import { LocalUI } from '../../enums/local-ui';

@Component({
  selector: 'spec-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  ui = UI;
  localUi = LocalUI;

  private filter: ProjectsFilter;

  progress = {loading: false, deleting: false};
  reference: { popover: PopoverInstance } = {popover: null};

  projects: Project[] = [];

  constructor(private deleteProjectGQL: DeleteProjectGQL,
              private allProjectsGQL: AllProjectsGQL,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.load(true);
  }

  load(loading: boolean = false) {
    this.progress.loading = loading;
    this.allProjectsGQL.fetch(this.filter as R).pipe(
      delay(UI_DELAY),
      finalize(() => this.progress.loading = false),
      map(({data: {allProjects}}) => deserialize(allProjects, PagingProjects))
    ).subscribe(paging => this.projects = paging.results);
  }

  delete(id: string) {
    this.progress.deleting = true;
    this.deleteProjectGQL.mutate({id} as R)
      .pipe(delay(UI_DELAY),
        finalize(() => this.progress.deleting = false))
      .subscribe(() => this.load());
  }

  trackProject(index: number, project: Project) {
    return project.id;
  }

  goto(project: Project) {
    this.reference.popover?.hide();
    this.load();
    this.router.navigate([project.id], {relativeTo: this.route});
  }

}
