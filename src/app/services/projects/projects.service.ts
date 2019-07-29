import { Injectable } from '@angular/core';
import { HttpService } from 'junte-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { deserialize } from 'serialize-ts/dist';
import { PagingProjects, Project } from 'src/app/model/projects';
import { IProjectsService } from 'src/app/services/projects/projects.interface';

@Injectable()
export class ProjectsService implements IProjectsService {

    constructor(private http: HttpService) {
    }

    list(): Observable<PagingProjects> {
        return this.http.get('projects')
            .pipe(map(obj => deserialize(obj, PagingProjects)));
    }

    get(id: string): Observable<Project> {
        return this.http.get(`projects/${id}`)
            .pipe(map(obj => deserialize(obj, Project)));
    }

    create(title: string): Observable<Project> {
        return this.http.post('projects', {title: title})
            .pipe(map(obj => deserialize(obj, Project)));
    }

    edit(id: string, title: string): Observable<Project> {
        return this.http.patch(`projects/${id}`, {title: title})
            .pipe(map(obj => deserialize(obj, Project)));
    }

    delete(id: string): Observable<any> {
        return this.http.delete(`projects/${id}`);
    }
}
