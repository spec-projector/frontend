import {Component, OnInit} from '@angular/core';
import {UI} from 'junte-ui';
import {Space} from '../../../model/space';
import {ActivatedRoute} from '@angular/router';
import {Package} from '../../../model/orm/package';
import {isUndefined} from 'util';
import * as uuid from 'uuid/v1';
import {SpaceManager} from '../../services/space-manager.service';
import {EditMode} from "../../../enums/edit-mode";

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
        const index1 = isUndefined(event.index) ? this.space.packages.length - 1 : event.index;
        const index2 = event.data;
        const p1 = this.space.packages[index1];
        const p2 = this.space.packages[index2];
        this.space.packages.splice(index1, 1, p2);
        this.space.packages.splice(index2, 1, p1);

        this.manager.put(this.space);
    }


}
