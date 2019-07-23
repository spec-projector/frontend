import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Error } from 'junte-angular';
import { UI } from 'junte-ui';
import { finalize } from 'rxjs/operators';
import { Project } from 'src/app/models/projects';
import { IProjectsService, projects_service } from 'src/app/services/projects/projects.interface';

@Component({
    selector: 'spec-projects',
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

    projects: Project[];
    loading = false;
    error: Error;
    ui = UI;
    title = new FormControl();

    form = this.formBuilder.group({
        title: this.title
    });

    constructor(@Inject(projects_service) private projectsService: IProjectsService,
                private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.load();
    }

    load() {
        this.loading = true;
        this.projectsService.list().pipe(finalize(() => this.loading = false))
            .subscribe(paging => this.projects = paging.results,
                error => this.error = error);
    }

    create() {
        if (!!this.title.value) {
            this.projectsService.create(this.title.value)
                .subscribe(() => {
                    this.load();
                    this.title.reset();
                }, error => this.error = error);
        }
    }

    delete(id: string) {
        this.projectsService.delete(id).subscribe(() => this.load());
    }

    trackProject(index: number, project: Project) {
        return project.id;
    }

}
