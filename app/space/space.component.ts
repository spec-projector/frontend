import {Component, OnInit} from '@angular/core';
import {UI} from 'junte-ui';
import {Space} from '../../model/space';
import {ValidationError} from '../../validation/error';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-space',
    templateUrl: './space.component.html',
    styleUrls: ['./space.component.scss']
})
export class SpaceComponent implements OnInit {
    ui = UI;

    space: Space;
    errors: ValidationError[] = [];

    constructor(private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.data.subscribe(({space}) => this.space = space);
    }
}
