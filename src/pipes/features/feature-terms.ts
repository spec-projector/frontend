import { Pipe, PipeTransform } from '@angular/core';
import { Feature } from 'src/model/spec/planning/feature';
import { Term } from 'src/model/spec/planning/term';

@Pipe({name: 'featureTerms'})
export class FeatureTermsPipe implements PipeTransform {
    transform(feature: Feature): Term[] {
        return feature.getTerms();
    }
}
