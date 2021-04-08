import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { deserialize } from 'serialize-ts';
import { MeUser } from 'src/models/user';
import { MeGQL } from './graphql';

@Injectable({providedIn: 'root'})
export class MeUserResolver implements Resolve<Observable<MeUser>> {

  constructor(private meGQL: MeGQL) {
  }

  resolve(route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot): Observable<MeUser> {
    return this.meGQL.fetch()
      .pipe(map(({data: {me}}) => !!me ? deserialize(me, MeUser) : null));
  }
}
