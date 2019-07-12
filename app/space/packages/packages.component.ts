import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpaceManager } from 'app/services/space-manager.service';
import { EditMode } from 'enums/edit-mode';
import { UI } from 'junte-ui';
import { Package } from 'model/orm/package';
import { Space } from 'model/space';
import * as uuid from 'uuid/v1';

@Component({
    selector: 'app-packages',
    templateUrl: './packages.component.html',
    styleUrls: ['./packages.component.scss']
})
export class PackagesComponent implements OnInit {

    ui = UI;
    editMode = EditMode;

    space: Space;

    constructor(public manager: SpaceManager,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.data.subscribe(({space}) => this.space = space);
    }

    addPackage() {
        const pack = new Package({
            id: uuid(),
            name: 'package',
            title: 'Package'
        });
        this.space.packages.unshift(pack);

        this.manager.put(pack);
        this.manager.put(this.space);
    }

    deletePackage(index: number) {
        const pack = this.space.packages[index];
        this.space.packages.splice(index, 1);

        this.manager.remove(pack);
        this.manager.put(this.space);

    }

    movePackage(event: any) {
        moveItemInArray(this.space.packages, event.previousIndex, event.currentIndex);
        this.manager.put(this.space);
    }

    trackPackage(index: number, pack: Package) {
        return !!pack ? pack.id : null;
    }
}
