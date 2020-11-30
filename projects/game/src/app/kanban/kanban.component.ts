import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UI } from '@junte/ui';
import { KanbanManager } from 'projects/game/src/app/kanban/kanban.manager';
import { Group } from 'projects/game/src/models/group';
import { Kanban } from 'projects/game/src/models/kanban';
import * as uuid from 'uuid/v1';

@Component({
    selector: 'app-kanban',
    templateUrl: './kanban.component.html',
    styleUrls: ['./kanban.component.scss']
})
export class KanbanComponent implements OnInit {

    kanban: Kanban;
    ids: string[] = [];
    ui = UI;

    constructor(private kanbanManager: KanbanManager,
                private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.route.data.subscribe(({kanban}) => {
            this.kanban = kanban;
            this.ids = kanban.groups.map(group => group.id);
        });
    }

    addGroup() {
        const group = new Group({title: 'New Group', id: uuid()});
        group.linking(this.kanban);
        this.kanban.groups.push(group);
        this.kanbanManager.put(group);
        this.kanbanManager.put(this.kanban);
        this.ids.push(group.id);
    }

    deleteGroup(index: number) {
        this.kanban.groups.splice(index, 1);
        this.ids.splice(index, 1);
        this.kanbanManager.put(this.kanban);
    }
}
