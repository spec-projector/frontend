import { Pipe, PipeTransform } from '@angular/core';
import { Language } from '../../enums/language';

@Pipe({name: 'localizePage'})
export class LocalizePagePipe implements PipeTransform {
  transform(language: Language): string {
    return document.location.pathname.replace(/^\/(ru|en)\//, `/${language}/`);
  }
}
