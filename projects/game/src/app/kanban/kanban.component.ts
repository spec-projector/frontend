import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KanbanManager } from 'projects/game/src/app/kanban/kanban.manager';
import { Issue } from 'projects/game/src/models/issue';
import { Kanban } from 'projects/game/src/models/kanban';

@Component({
    selector: 'app-kanban',
    templateUrl: './kanban.component.html',
    styleUrls: ['./kanban.component.scss']
})
export class KanbanComponent implements OnInit {

    kanban: Kanban;

    constructor(private kanbanManager: KanbanManager,
                private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.route.data.subscribe(({kanban}) => this.kanban = kanban);
    }

    drop(event: CdkDragDrop<Issue[]>) {
        const current = this.kanban.groups.find(group => group.code === event.container.id);
        const prev = this.kanban.groups.find(group => group.code === event.previousContainer.id);

        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex);
            this.kanbanManager.put(prev);
        }
        this.kanbanManager.put(current);
    }
}
