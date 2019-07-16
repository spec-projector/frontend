import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpaceManager } from 'src/app/services/space-manager.service';
import { EditMode } from 'src/enums/edit-mode';
import { UI } from 'junte-ui';
import { EntityField } from 'src/model/orm/entity-field';
import { Epic } from 'src/model/planning/epic';
import { Space } from 'src/model/space';
import * as uuid from 'uuid/v1';

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

    moveEpic(event: CdkDragDrop<Epic[]>) {
        moveItemInArray(this.space.epics, event.previousIndex, event.currentIndex);
        this.manager.put(this.space);
    }

}
