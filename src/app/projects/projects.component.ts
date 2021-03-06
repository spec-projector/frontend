import { Component, ComponentFactoryResolver, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { deserialize } from 'serialize-ts';
import { ModalService, PopoverInstance, UI } from '@junte/ui';
import { R } from 'apollo-angular/types';
import { delay, finalize, map, tap } from 'rxjs/operators';
import { Skills } from '../../enums/skills';
import { AllProjectsGQL, DeleteProjectGQL } from './graphql';
import { PagingProjects, Project, ProjectsFilter } from 'src/models/project';
import { UI_DELAY } from '../../consts';
import { LocalUI } from '../../enums/local-ui';
import { EditProjectComponent } from './edit-project/edit-project.component';
import { MeUser } from '../../models/user';
import { AnalyticsType } from 'src/enums/analyticsType';

export const I18N_ADD_PROJECT = $localize`:@@label.add_project:Add project`;
export const I18N_EDIT_PROJECT = $localize`:@@label.edit_project:Edit project`;

@Component({
  selector: 'spec-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  ui = UI;
  localUi = LocalUI;
  skills = Skills;
  analyticsType = AnalyticsType;

  private filter: ProjectsFilter;

  progress = {loading: false, deleting: false};
  reference: { popover: PopoverInstance } = {popover: null};

  me: MeUser;
  projects: Project[] = [];

  constructor(private deleteProjectGQL: DeleteProjectGQL,
              private allProjectsGQL: AllProjectsGQL,
              private modal: ModalService,
              private injector: Injector,
              private cfr: ComponentFactoryResolver,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.route.data.subscribe(({me}) => this.me = me);
    this.load();
  }

  load() {
    this.progress.loading = true;
    this.allProjectsGQL.fetch(this.filter as R).pipe(
      delay(UI_DELAY),
      finalize(() => this.progress.loading = false),
      map(({data: {projects}}) => deserialize(projects, PagingProjects))
    ).subscribe(paging => this.projects = paging.results);
  }

  trackProject(index: number, project: Project) {
    return project.id;
  }

  add(skill: Skills = Skills.all) {
    const factory = this.cfr.resolveComponentFactory(EditProjectComponent);
    const component = factory.create(this.injector);
    component.instance.skill = skill;
    component.instance.saved.subscribe(({project, demo: d}) => this.goto(project, d));
    this.modal.open(component, {
      title: {
        icon: LocalUI.icons.project,
        text: I18N_ADD_PROJECT
      }
    });
  }

  edit(project: Project, index: number) {
    const factory = this.cfr.resolveComponentFactory(EditProjectComponent);
    const component = factory.create(this.injector);
    component.instance.project = project;
    component.instance.saved.subscribe(({project: p}) => {
      this.modal.close();
      this.projects[index] = p;
    });
    this.modal.open(component, {
      title: {
        icon: LocalUI.icons.project,
        text: I18N_EDIT_PROJECT
      }
    });
  }

  goto(project: Project, demo: boolean = false) {
    this.modal.close();
    this.load();
    this.router.navigate([project.id, !!demo ? {demo: 'y'} : {}], {relativeTo: this.route});
  }

  delete(id: string, hide: Function) {
    this.progress.deleting = true;
    this.deleteProjectGQL.mutate({id} as R)
      .pipe(delay(UI_DELAY),
        finalize(() => {
          this.progress.deleting = false;
          hide();
        }))
      .subscribe(() => this.load());
  }

}
