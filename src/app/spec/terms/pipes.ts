import { Pipe, PipeTransform } from '@angular/core';
import { Token } from 'src/models/spec/planning/token';
import { Spec } from 'src/models/spec/spec';

@Pipe({name: 'termDescription'})
export class TermDescriptionPipe implements PipeTransform {

    transform(name: string, spec: Spec): Token[] {
        const term = spec.terms.find(t => t.title === name);
        return !!term ? term.description : null;
    }
}
