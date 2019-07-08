import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Space} from '../../model/space';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {SpaceManager} from '../services/space-manager.service';

@Injectable()
export class SpaceResolver implements Resolve<Space> {

    constructor(private spaceService: SpaceManager) {
    }

    resolve(route: ActivatedRouteSnapshot,
            state: RouterStateSnapshot): Observable<Space> {
        return this.spaceService.get(route.params['project'], route.params['space']);
    }
}
