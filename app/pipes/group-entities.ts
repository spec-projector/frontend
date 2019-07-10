import { Pipe, PipeTransform } from '@angular/core';
import { Entity } from 'model/orm/entity';
import { Package } from 'model/orm/package';

@Pipe({name: 'groupEntities'})
export class GroupEntitiesPipe implements PipeTransform {
    transform(packages: Package[]): Entity[] {
        return packages.reduce((entities, pack) => entities.concat(pack.entities), []);
    }
}
