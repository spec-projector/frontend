import { Pipe, PipeTransform } from '@angular/core';
import { Issue } from '../../../../models/spec/planning/feature/issue';
import { Resource } from '../../../../models/spec/planning/feature/resource';

@Pipe({name: 'estimatedTime'})
export class EstimatedTimePipe implements PipeTransform {

  transform(resources: Resource[], version = 0): number {
    return resources.reduce((sum, r) => sum + r.hours || 0, 0);
  }
}

@Pipe({name: 'spentTime'})
export class SpentTimePipe implements PipeTransform {
  transform(resources: Issue[], version = 0): number {
    return Math.round(resources.reduce((sum, r) => sum + r.spent || 0, 0));
  }
}
