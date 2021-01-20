import { Component, ComponentFactoryResolver, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { deserialize } from 'serialize-ts';
import { ModalService, PopoverInstance, UI } from '@junte/ui';
import { R } from 'apollo-angular/types';
import { delay, finalize, map, tap } from 'rxjs/operators';
import { AllProjectsGQL, DeleteProjectGQL } from 'src/app/projects/projects.graphql';
import { PagingProjects, Project, ProjectsFilter } from 'src/model/projects';
import { UI_DELAY } from '../../consts';
import { LocalUI } from '../../enums/local-ui';
import { EditProjectComponent } from './edit-project/edit-project.component';

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
              private modal: ModalService,
              private injector: Injector,
              private cfr: ComponentFactoryResolver,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
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

  add() {
    const factory = this.cfr.resolveComponentFactory(EditProjectComponent);
    const component = factory.create(this.injector);
    component.instance.saved.subscribe(p => this.goto(p));
    this.modal.open(component, {title: {text: 'Add project'}});
  }

  edit(project: Project, index: number) {
    const factory = this.cfr.resolveComponentFactory(EditProjectComponent);
    const component = factory.create(this.injector);
    component.instance.project = project;
    component.instance.saved.subscribe(p => {
      this.modal.close();
      this.projects[index] = p;
    });
    this.modal.open(component, { title: {text: 'Edit project'}});
  }

  goto(project: Project) {
    this.modal.close();
    this.load();
    this.router.navigate([project.id], {relativeTo: this.route});
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
