import { Pipe, PipeTransform } from '@angular/core';
import { Token } from 'src/app/model/spec/planning/token';
import { Spec } from 'src/app/model/spec/spec';

@Pipe({name: 'termDescription'})
export class TermDescriptionPipe implements PipeTransform {

    transform(name: string, spec: Spec): Token[] {
        const term = spec.terms.find(t => t.name === name);
        return !!term ? term.description : null;
    }
}