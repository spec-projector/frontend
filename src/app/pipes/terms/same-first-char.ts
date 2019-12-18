import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'sameFirstChar'})
export class SameFirstCharPipe implements PipeTransform {

    transform(current: string, previous: string): boolean {
        if (!current || !previous) {
            return false;
        }
        return current[0] === previous[0];
    }
}
