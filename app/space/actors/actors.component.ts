import {Component, OnInit} from '@angular/core';
import {Space} from '../../../model/space';
import {ActivatedRoute} from '@angular/router';
import {UI} from 'junte-ui';
import {SpaceManager} from "../../services/space-manager.service";
import {EditMode} from "../../../enums/edit-mode";
import {Entity} from "../../../model/orm/entity";
import * as uuid from 'uuid/v1';
import {Actor} from "../../../model/planning/actor";

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

}
