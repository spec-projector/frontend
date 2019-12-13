import { Component, ComponentFactoryResolver, Injector, OnInit } from '@angular/core';
import { R } from 'apollo-angular/types';
import { ModalService, UI } from 'junte-ui';
import { finalize, map, switchMap } from 'rxjs/operators';
import { deserialize, serialize } from 'serialize-ts/dist';
import { EditProjectComponent } from 'src/app/components/projects/edit-project/edit-project.component';
import { AllProjectsGQL, CreateProjectGQL, DeleteProjectGQL, UpdateProjectGQL } from 'src/app/components/projects/projects.graphql';
import { Error } from 'src/app/model/errors';
import { PagingProjects, Project, ProjectsFilter, ProjectUpdate } from 'src/app/model/projects';

@Component({
    selector: 'spec-projects',
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

    private filter: ProjectsFilter;
    projects: Project[] = [];
    loading = false;
    error: Error;
    ui = UI;

    constructor(private deleteProjectGQL: DeleteProjectGQL,
                private createProjectGQL: CreateProjectGQL,
                private updateProjectGQL: UpdateProjectGQL,
                private allProjectsGQL: AllProjectsGQL,
                private cfr: ComponentFactoryResolver,
                private injector: Injector,
                private modalService: ModalService) {
    }

    ngOnInit() {
        this.load(true);
    }

    load(loading: boolean = false) {
        this.loading = loading;
        this.allProjectsGQL.fetch(this.filter as R).pipe(
            finalize(() => this.loading = false),
            map(({data: {allProjects}}) => deserialize(allProjects, PagingProjects))
        ).subscribe(paging => this.projects = paging.results);
    }

    edit(project: Project = null) {
        const component = this.cfr.resolveComponentFactory(EditProjectComponent).create(this.injector);
        const mutation = !!project ? this.updateProjectGQL : this.createProjectGQL;
        component.instance.title.setValue(project ? project.title : null);
        component.instance.saved.pipe(switchMap(title => {
            const update = new ProjectUpdate({title, project: !!project ? project.id : null});
            return mutation.mutate(serialize(update) as R);
        })).subscribe(() => {
            this.load();
            this.modalService.close();
        }, error => this.error = error);
        this.modalService.open(component);
    }

    delete(project: string) {
        this.deleteProjectGQL.mutate({project})
            .subscribe(() => this.load());
    }

    trackProject(index: number, project: Project) {
        return project.id;
    }
}
