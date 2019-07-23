import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { SpecManager } from 'src/app/managers/spec.manager';
import { Sprint } from 'src/app/model/spec/planning/sprint';
import { Observable } from 'rxjs';


@Injectable()
export class SprintResolver implements Resolve<Sprint> {

    constructor(private manager: SpecManager) {
    }

    resolve(route: ActivatedRouteSnapshot,
            state: RouterStateSnapshot): Observable<Sprint> {
        return Observable.create(o => {
            this.manager.get(route.params['project'], route.params['space'])
                .subscribe(space => {
                    const sprint = space.sprints.find(s => s.id === route.params['sprint']);
                    o.next(sprint);
                    o.complete();
                });
        });
    }
}
