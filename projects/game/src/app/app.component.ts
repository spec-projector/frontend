import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UI } from 'junte-ui';
import { characters, generate } from 'shortid';
import { KanbanManager } from 'projects/game/src/app/kanban/kanban.manager';

characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent {

    ui = UI;

    constructor(private kanbanManager: KanbanManager,
                private router: Router) {
    }

    import() {
        let id = generate().toLowerCase();
        while (!id.match(/^[a-z].*/)) {
            id = generate().toLowerCase();
        }

        this.kanbanManager.import(id).subscribe(kanban => {
            console.log('imported');
            console.log(kanban.id);
            this.router.navigate(['..', 'kanban', id, kanban.id]);
        });
    }
}
