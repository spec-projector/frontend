import { Pipe, PipeTransform } from '@angular/core';
import { Entity } from 'src/models/spec/orm/entity';
import { Package } from 'src/models/spec/orm/package';
import { Enum } from '../models/spec/orm/enum';

@Pipe({name: 'groupEntities'})
export class GroupEntitiesPipe implements PipeTransform {
    transform(packages: Package[]): Entity[] {
        return packages.reduce((entities, pack) => entities.concat(pack.entities), []);
    }
}

@Pipe({name: 'groupEnums'})
export class GroupEnumsPipe implements PipeTransform {
  transform(packages: Package[]): Enum[] {
    return packages.reduce((enums, pack) => enums.concat(pack.enums), []);
  }
}
