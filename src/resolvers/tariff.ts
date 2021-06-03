import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { deserialize } from 'serialize-ts';
import { Tariff } from '../models/tariff';
import { TariffGQL } from './graphql';

@Injectable({providedIn: 'root'})
export class TariffResolver implements Resolve<Observable<Tariff>> {

  constructor(private tariffGQL: TariffGQL) {
  }

  resolve(route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot): Observable<Tariff> {
    const {tariff: id} = route.params;
    return !!id ? this.tariffGQL.fetch({id})
      .pipe(map(({data: {tariff}}) => deserialize(tariff, Tariff))) : of(null);
  }
}
