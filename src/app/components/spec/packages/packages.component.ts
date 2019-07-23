import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpecManager } from 'src/app/managers/spec.manager';
import { EditMode } from 'src/app/model/enums/edit-mode';
import { UI } from 'junte-ui';
import { Package } from 'src/app/model/spec/orm/package';
import { Spec } from 'src/app/model/spec/spec';
import * as uuid from 'uuid/v1';

@Component({
    selector: 'spec-packages',
    templateUrl: './packages.component.html',
    styleUrls: ['./packages.component.scss']
})
export class PackagesComponent implements OnInit {

    ui = UI;
    editMode = EditMode;

    space: Spec;

    constructor(public manager: SpecManager,
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
