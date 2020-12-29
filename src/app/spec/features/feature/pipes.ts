import { Pipe, PipeTransform } from '@angular/core';
import { Resource } from '../../../../model/spec/planning/feature';
import { Issue } from '../../../../model/spec/planning/issue';

@Pipe({name: 'estimatedTime', pure: false})
export class EstimatedTimePipe implements PipeTransform {

  transform(resources: Resource[]): number {
    return resources.reduce((sum, r) => sum + r.hours || 0, 0);
  }
}

@Pipe({name: 'spentTime', pure: false})
export class SpentTimePipe implements PipeTransform {
  transform(resources: Issue[]): number {
    return Math.round(resources.reduce((sum, r) => sum + r.spent || 0, 0));
  }
}
