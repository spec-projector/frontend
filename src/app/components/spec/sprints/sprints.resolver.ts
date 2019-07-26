import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { SpecManager } from 'src/app/managers/spec.manager';
import { Sprint } from 'src/app/model/spec/planning/sprint';


@Injectable()
export class SprintResolver implements Resolve<Sprint> {

    constructor(private manager: SpecManager) {
    }

    resolve(route: ActivatedRouteSnapshot,
            state: RouterStateSnapshot): Observable<Sprint> {
        return Observable.create(observer => {
            this.manager.get(route.params['project'])
                .subscribe(spec => {
                    const sprint = spec.sprints.find(s => s.id === route.params['sprint']);
                    observer.next(sprint);
                    observer.complete();
                });
        });
    }
}
