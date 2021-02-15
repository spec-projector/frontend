import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { Feature } from 'src/model/spec/planning/feature';

@Pipe({name: 'featurePrice'})
export class FeaturePricePipe implements PipeTransform {
  transform(feature: Feature, ..._): Observable<number> {
    return new Observable<number>(o => {
      setTimeout(() => {
        const cost = feature.resources.reduce((price, r) => {
          const resource = feature.spec.resourceTypes.find(res => res.title === r.resource);
          return price + (!!resource ? resource.hourRate * r.hours : 0);
        }, 0);
        o.next(cost);
        o.complete();
      }, Math.random() * 500);
    });
  }
}
