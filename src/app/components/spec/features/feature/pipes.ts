import { Pipe, PipeTransform } from '@angular/core';
import { Resource } from '../../../../model/spec/planning/feature';
import { Issue } from '../../../../model/spec/planning/issue';

@Pipe({name: 'estimatedTime'})
export class EstimatedTimePipe implements PipeTransform {

  transform(resources: Resource[], ..._): number {
    return resources.reduce((sum, r) => sum + r.hours || 0, 0);
  }
}

@Pipe({name: 'spentTime'})
export class SpentTimePipe implements PipeTransform {
  transform(resources: Issue[], ..._): number {
    return Math.round(resources.reduce((sum, r) => sum + r.spent || 0, 0));
  }
}
