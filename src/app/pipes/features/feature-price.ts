import { Pipe, PipeTransform } from '@angular/core';
import { Feature } from 'src/app/model/spec/planning/feature';

@Pipe({name: 'featurePrice'})
export class FeaturePricePipe implements PipeTransform {
  transform(feature: Feature, ..._): number {
    return feature.resources.reduce((price, r) => {
      const resource = feature.spec.resourceTypes.find(res => res.title === r.resource);
      return price + (!!resource ? resource.hourRate * r.hours : 0);
    }, 0);
  }
}
