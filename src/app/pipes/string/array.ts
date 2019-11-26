import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'encodeURI'})
export class EncodeURIPipe implements PipeTransform {
    transform(source: string): string {
        return encodeURI(source);
    }
}
