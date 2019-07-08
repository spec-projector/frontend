import {Component, OnInit} from '@angular/core';
import {Space} from '../../../model/space';
import {ActivatedRoute} from '@angular/router';
import {UI} from 'junte-ui';
import {SpaceManager} from "../../services/space-manager.service";
import {EditMode} from "../../../enums/edit-mode";
import {Actor} from "../../../model/planning/actor";
import * as uuid from 'uuid/v1';
import {Epic} from "../../../model/planning/epic";

@Component({
    selector: 'app-epics',
    templateUrl: './epics.component.html',
    styleUrls: ['./epics.component.scss']
})
export class EpicsComponent implements OnInit {

    ui = UI;
    editMode = EditMode;

    space: Space;

    constructor(public manager: SpaceManager,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.data.subscribe(({space}) => this.space = space);
    }

    addEpic() {
        const epic = new Epic({
            id: uuid(),
            title: 'Some functionality'
        });
        this.space.epics.unshift(epic);

        this.manager.put(epic);
        this.manager.put(this.space);
    }

    deleteEpic(index: number) {
        const epic = this.space.epics[index];
        this.space.epics.splice(index, 1);
        this.manager.remove(epic);
        this.manager.put(this.space);
    }

}
