import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpecManager } from 'src/app/managers/spec.manager';
import { EditMode } from 'src/app/model/enums/edit-mode';
import { UI } from 'junte-ui';
import { Actor } from 'src/app/model/spec/planning/actor';
import { Spec } from 'src/app/model/spec/spec';
import * as uuid from 'uuid/v1';

@Component({
    selector: 'spec-actors',
    templateUrl: './actors.component.html',
    styleUrls: ['./actors.component.scss']
})
export class ActorsComponent implements OnInit {

    ui = UI;
    editMode = EditMode;

    space: Spec;

    constructor(public manager: SpecManager,
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
