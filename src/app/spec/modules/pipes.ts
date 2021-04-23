import { Pipe, PipeTransform } from '@angular/core';
import { Spec } from 'src/models/spec/spec';

@Pipe({name: 'modulesIds'})
export class ModulesIdsPipe implements PipeTransform {

  transform(spec: Spec): string[] {
    return spec.modules.map(m => `_${m.id}`);
  }

}
