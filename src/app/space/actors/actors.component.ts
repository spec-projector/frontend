import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpaceManager } from 'src/app/services/space-manager.service';
import { EditMode } from 'src/enums/edit-mode';
import { UI } from 'junte-ui';
import { Actor } from 'src/model/planning/actor';
import { Space } from 'src/model/space';
import * as uuid from 'uuid/v1';

@Component({
    selector: 'app-actors',
    templateUrl: './actors.component.html',
    styleUrls: ['./actors.component.scss']
})
export class ActorsComponent implements OnInit {

    ui = UI;
    editMode = EditMode;

    space: Space;

    constructor(public manager: SpaceManager,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.data.subscribe(({space}) => this.space = space);
    }

    addActor() {
        const actor = new Actor({
            id: uuid(),
            name: 'Some person'
        });
        this.space.actors.unshift(actor);

        this.manager.put(actor);
        this.manager.put(this.space);
    }

    deleteActor(index: number) {
        const actor = this.space.actors[index];
        this.space.actors.splice(index, 1);
        this.manager.remove(actor);
        this.manager.put(this.space);
    }

    moveActor(event: CdkDragDrop<Actor[]>) {
        moveItemInArray(this.space.actors, event.previousIndex, event.currentIndex);
        this.manager.put(this.space);
    }

    trackActor(index: number, actor: Actor) {
        return !!actor ? actor.id : null;
    }
}
