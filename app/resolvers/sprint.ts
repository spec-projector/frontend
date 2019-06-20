import {HttpClient} from '@angular/common/http';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Space} from '../../model/space';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {deserialize} from 'serialize-ts/dist';
import {Sprint} from '../../model/planning/sprint';


@Injectable()
export class SprintResolver implements Resolve<Sprint> {

    constructor(private http: HttpClient) {
    }

    resolve(route: ActivatedRouteSnapshot,
            state: RouterStateSnapshot): Observable<Sprint> {
        return Observable.create((o) => {
            this.http.get('space.json')
                .pipe(map(space => deserialize(space, Space)),
                    tap(space => space.linking()))
                .subscribe(space => {
                    const sprint = space.sprints.find(s => s.id === route.params['sprint']);
                    o.next(sprint);
                    o.complete();
                });
        });
    }
}
