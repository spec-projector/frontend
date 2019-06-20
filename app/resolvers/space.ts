import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Space} from '../../model/space';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {SpaceService} from '../services/space.service';

@Injectable()
export class SpaceResolver implements Resolve<Space> {

    constructor(private spaceService: SpaceService) {
    }

    resolve(route: ActivatedRouteSnapshot,
            state: RouterStateSnapshot): Observable<Space> {
        return this.spaceService.get(route.params['project'], route.params['space']);
    }
}
