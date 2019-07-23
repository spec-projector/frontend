import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { PagingProjects, Project } from 'src/app/model/projects';

export interface IProjectsService {
    list(): Observable<PagingProjects>;

    get(id: string): Observable<Project>;

    create(title: string): Observable<Project>;

    delete(id: string): Observable<any>;
}

export let projects_service = new InjectionToken('projects_service');
