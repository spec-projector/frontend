import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UI } from 'junte-ui';
import { SpecManager } from 'src/app/managers/spec.manager';
import { EditMode } from 'src/app/model/enums/edit-mode';
import { Epic } from 'src/app/model/spec/planning/epic';
import { Spec } from 'src/app/model/spec/spec';
import * as uuid from 'uuid/v1';

@Component({
    selector: 'spec-epics',
    templateUrl: './epics.component.html',
    styleUrls: ['./epics.component.scss']
})
export class EpicsComponent implements OnInit {

    ui = UI;
    editMode = EditMode;

    space: Spec;

    constructor(public manager: SpecManager,
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
