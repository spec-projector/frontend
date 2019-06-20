import {Pipe, PipeTransform} from '@angular/core';
import {AccentToken, TermToken, TextToken, Token, TokenType} from '../../model/planning/token';
import {Term} from '../../model/planning/term';
import {Feature} from '../../model/planning/feature';

@Pipe({name: 'featureTerms'})
export class FeatureTermsPipe implements PipeTransform {
    transform(feature: Feature): Term[] {
        return feature.getTerms();
    }
}
