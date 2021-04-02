import { Pipe, PipeTransform } from '@angular/core';
import { Spec } from 'src/models/spec/spec';

@Pipe({name: 'features'})
export class FeaturesPipe implements PipeTransform {

    transform(spec: Spec): string[] {
        let features = [];
        spec.actors.forEach(actor => features = [...features, ...actor.features]);
        return features.map(feature => `feature-${feature.id}`);
    }

}
