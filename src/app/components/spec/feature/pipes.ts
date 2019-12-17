import { Pipe, PipeTransform } from '@angular/core';
import { Resource } from '../../../model/spec/planning/feature';

@Pipe({name: 'estimatedTime'})
export class EstimatedTimePipe implements PipeTransform {

    transform(resources: Resource[]): number {
        return resources.reduce((sum, r) => sum + r.hours, 0);
    }
}
