import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpecManager } from 'src/managers/spec.manager';
import { EditMode } from 'src/enums/edit-mode';
import { UI } from '@junte/ui';
import { Package } from 'src/model/spec/orm/package';
import { Spec } from 'src/model/spec/spec';
import * as uuid from 'uuid/v1';
import { LocalUI } from '../../../enums/local-ui';

@Component({
    selector: 'spec-packages',
    templateUrl: './packages.component.html',
    styleUrls: ['./packages.component.scss']
})
export class PackagesComponent implements OnInit {

    ui = UI;
    localUi = LocalUI;
    editMode = EditMode;

    spec: Spec;

    constructor(public manager: SpecManager,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.data.subscribe(({spec}) => this.spec = spec);
    }

    addPackage() {
        const pack = new Package({
            id: uuid(),
            name: 'package',
            title: 'Package'
        });
        this.spec.packages.unshift(pack);

        this.manager.put(pack);
        this.manager.put(this.spec);
    }

    deletePackage(index: number) {
        const pack = this.spec.packages[index];
        this.spec.packages.splice(index, 1);

        this.manager.remove(pack);
        this.manager.put(this.spec);

    }

    movePackage(event: any) {
        moveItemInArray(this.spec.packages, event.previousIndex, event.currentIndex);
        this.manager.put(this.spec);
    }

    trackPackage(index: number, pack: Package) {
        return !!pack ? pack.id : null;
    }
}
