import { Pipe, PipeTransform } from '@angular/core';
import { Kanban } from 'projects/game/src/models/kanban';

@Pipe({name: 'codes'})
export class CodesPipe implements PipeTransform {

    transform(kanban: Kanban): string[] {
        return kanban.groups.map(group => group.code);
    }

}
