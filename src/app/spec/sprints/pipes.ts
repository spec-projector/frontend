import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { Actor } from 'src/models/spec/planning/actor';
import { Sprint } from '../../../models/spec/planning/sprint';

@Pipe({name: 'sprintPrice'})
export class SprintPricePipe implements PipeTransform {
  transform(sprint: Sprint): Observable<number> {
    return new Observable<number>(o => {
      const cost = sprint.features.reduce((total, feature) => {
        return total + feature.resources.reduce((price, r) => {
          const resource = feature.spec.resourceTypes
            .find(res => res.title === r.resource);
          return price + (!!resource ? resource.hourRate * r.hours : 0);
        }, 0);
      }, 0);
      o.next(cost);
      o.complete();
    });
  }
}
