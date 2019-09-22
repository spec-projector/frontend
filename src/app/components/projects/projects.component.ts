import { Component, ComponentFactoryResolver, Inject, Injector, OnInit } from '@angular/core';
import { ModalService, UI } from 'junte-ui';
import { finalize, switchMap } from 'rxjs/operators';
import { EditProjectComponent } from 'src/app/components/projects/edit-project/edit-project.component';
import { Error } from 'src/app/model/errors';
import { Project } from 'src/app/model/projects';
import { IProjectsService, projects_service } from 'src/app/services/projects/projects.interface';

@Component({
    selector: 'spec-projects',
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

    projects: Project[] = [];
    loading = false;
    error: Error;
    ui = UI;

    constructor(@Inject(projects_service) private projectsService: IProjectsService,
                private cfr: ComponentFactoryResolver,
                private injector: Injector,
                private modalService: ModalService) {
    }

    ngOnInit() {
        this.load(true);
    }

    load(loading: boolean = false) {
        this.loading = loading;
        this.projectsService.list().pipe(finalize(() => this.loading = false))
            .subscribe(paging => this.projects = paging.results,
                error => this.error = error);
    }

    create() {
        const component = this.cfr.resolveComponentFactory(EditProjectComponent).create(this.injector);
        component.instance.saved.pipe(switchMap(title => this.projectsService.create(title)))
            .subscribe(() => {
                this.load();
                this.modalService.close();
            }, error => this.error = error);
        this.modalService.open(component);
    }

    edit(project: Project) {
        const component = this.cfr.resolveComponentFactory(EditProjectComponent).create(this.injector);
        component.instance.title.setValue(project.title);
        component.instance.saved.pipe(switchMap(title => this.projectsService.edit(project.id, title)))
            .subscribe(() => {
                this.load();
                this.modalService.close();
            }, error => this.error = error);
        this.modalService.open(component);
    }

    delete(id: string) {
        this.projectsService.delete(id).subscribe(() => this.load());
    }

    trackProject(index: number, project: Project) {
        return project.id;
    }

}
