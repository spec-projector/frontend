import { Pipe, PipeTransform } from '@angular/core';
import { Term } from 'src/models/spec/planning/term';

@Pipe({name: 'sortByName'})
export class SortByNamePipe implements PipeTransform {

    transform(terms: Term[]): Term[] {
        return terms.sort((a, b) => a.name.localeCompare(b.name));
    }
}
