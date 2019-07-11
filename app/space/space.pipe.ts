import { Pipe, PipeTransform } from '@angular/core';
import { Space } from 'model/space';

@Pipe({name: 'features'})
export class SpacePipe implements PipeTransform {

    transform(space: Space): string[] {
        let features = [];
        space.actors.forEach(actor => features = [...features, ...actor.features]);
        return features.map(feature => `feature-${feature.id}`);
    }

}
