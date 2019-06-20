import {Pipe, PipeTransform} from '@angular/core';
import {Package} from '../../model/orm/package';
import {Entity} from '../../model/orm/entity';

@Pipe({name: 'groupEntities'})
export class GroupEntitiesPipe implements PipeTransform {
    transform(packages: Package[]): Entity[] {
        return packages.reduce((entities, pack) => entities.concat(pack.entities), []);
    }
}