import { Injectable } from '@angular/core';
import { HttpMockService } from 'junte-angular';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { deserialize } from 'serialize-ts/dist';
import { PagingProjects, Project } from 'src/app/model/projects';
import { IProjectsService } from 'src/app/services/projects/projects.interface';

@Injectable({providedIn: 'root'})
export class ProjectsMockService implements IProjectsService {

    constructor(private http: HttpMockService) {

    }

    list(): Observable<PagingProjects> {
        return this.http.get('projects/list.json')
            .pipe(map(obj => deserialize(obj, PagingProjects)));
    }

    get(id: string): Observable<Project> {
        return this.http.get('projects/get.json')
            .pipe(map(obj => deserialize(obj, Project)));
    }

    create(title: string): Observable<Project> {
        return this.http.get('projects/get.json')
            .pipe(map(obj => deserialize(obj, Project)));
    }

    edit(id: string, title: string): Observable<Project> {
        return this.http.get('projects/get.json')
            .pipe(map(obj => deserialize(obj, Project)));
    }

    delete(id: string): Observable<any> {
        return of(null);
    }
}
