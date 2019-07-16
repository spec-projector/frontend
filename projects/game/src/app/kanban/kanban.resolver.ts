import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Kanban } from 'projects/game/src/models/kanban';
import { KanbanManager } from 'projects/game/src/app/kanban/kanban.manager';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class KanbanResolver implements Resolve<Kanban> {

    constructor(private kanbanManager: KanbanManager) {
    }

    resolve(route: ActivatedRouteSnapshot,
            state: RouterStateSnapshot): Observable<Kanban> {
        return this.kanbanManager.get(route.params['id'], route.params['kanban']);
    }
}
