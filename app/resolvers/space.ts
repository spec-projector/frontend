import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { SpaceManager } from 'app/services/space-manager.service';
import { Space } from 'model/space';
import { Observable } from 'rxjs';

@Injectable()
export class SpaceResolver implements Resolve<Space> {

    constructor(private spaceService: SpaceManager) {
    }

    resolve(route: ActivatedRouteSnapshot,
            state: RouterStateSnapshot): Observable<Space> {
        return this.spaceService.get(route.params['project'], route.params['space']);
    }
}
