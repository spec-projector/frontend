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

    spec: Spec;

    constructor(public manager: SpecManager,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.data.subscribe(({spec}) => this.spec = spec);
    }

    addActor() {
        const actor = new Actor({
            id: uuid(),
            name: 'Some person'
        });
        this.spec.actors.unshift(actor);
        actor.linking(this.spec);

        this.manager.put(actor);
        this.manager.put(this.spec);
    }

    deleteActor(index: number) {
        const actor = this.spec.actors[index];
        this.spec.actors.splice(index, 1);
        this.manager.remove(actor);
        this.manager.put(this.spec);
    }

    moveActor(event: CdkDragDrop<Actor[]>) {
        moveItemInArray(this.spec.actors, event.previousIndex, event.currentIndex);
        this.manager.put(this.spec);
    }

    trackActor(index: number, actor: Actor) {
        return !!actor ? actor.id : null;
    }
}
