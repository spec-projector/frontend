import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { deserialize } from 'serialize-ts';
import { Me } from 'src/models/user';
import { MeGQL } from './graphql';

@Injectable({providedIn: 'root'})
export class MeUserResolver implements Resolve<Observable<Me>> {

  constructor(private meGQL: MeGQL) {
  }

  resolve(route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot): Observable<Me> {
    return this.meGQL.fetch()
      .pipe(map(({data: {me}}) => deserialize(me, Me)));
  }
}
