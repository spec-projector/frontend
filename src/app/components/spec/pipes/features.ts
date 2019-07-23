import { Pipe, PipeTransform } from '@angular/core';
import { Spec } from 'src/app/model/spec/spec';

@Pipe({name: 'features'})
export class FeaturesPipe implements PipeTransform {

    transform(space: Spec): string[] {
        let features = [];
        space.actors.forEach(actor => features = [...features, ...actor.features]);
        return features.map(feature => `feature-${feature.id}`);
    }

}
