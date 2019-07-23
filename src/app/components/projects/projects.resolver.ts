import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Project } from 'src/app/models/projects';
import { IProjectsService, projects_service } from 'src/app/services/projects/projects.interface';


@Injectable()
export class ProjectResolver implements Resolve<Project> {

    constructor(@Inject(projects_service) private projectsService: IProjectsService) {
    }

    resolve(route: ActivatedRouteSnapshot,
            state: RouterStateSnapshot): Observable<Project> {
        return this.projectsService.get(route.params['project_id']);
    }
}
