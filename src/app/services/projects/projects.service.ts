import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { deserialize } from 'serialize-ts';
import { PagingProjects, Project } from 'src/app/model/projects';
import { HttpService } from 'src/app/services/http.service';
import { IProjectsService } from 'src/app/services/projects/projects.interface';

@Injectable()
export class ProjectsService implements IProjectsService {

    constructor(private http: HttpService) {
    }

    list(): Observable<PagingProjects> {
        return this.http.get('projects')
            .pipe(map(obj => {
                console.log(obj);
                console.log(deserialize(obj, PagingProjects));
                return deserialize(obj, PagingProjects);
            }));
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
