import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {SpecManager} from 'src/app/managers/spec.manager';
import {Spec} from 'src/app/model/spec/spec';
import {Observable} from 'rxjs';

@Injectable()
export class SpecResolver implements Resolve<Spec> {

    constructor(private spaceService: SpecManager) {
    }

    resolve(route: ActivatedRouteSnapshot,
            state: RouterStateSnapshot): Observable<Spec> {
        const project = `project_${route.params['project']}`;
        return this.spaceService.get(project, project);
    }
}
