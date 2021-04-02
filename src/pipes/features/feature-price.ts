import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { Feature } from 'src/models/spec/planning/feature';

@Pipe({name: 'featurePrice', pure: false})
export class FeaturePricePipe implements PipeTransform {
  transform(feature: Feature): Observable<number> {
    return new Observable<number>(o => {
      const cost = feature.resources.reduce((price, r) => {
        const resource = feature.spec.resourceTypes.find(res => res.title === r.resource);
        return price + (!!resource ? resource.hourRate * r.hours : 0);
      }, 0);
      o.next(cost);
      o.complete();
    });
  }
}
