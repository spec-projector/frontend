import {Component, OnInit} from '@angular/core';
import {UI} from 'junte-ui';
import {Space} from '../../../model/space';
import {ActivatedRoute} from '@angular/router';
import {ValidationError} from '../../../validation/error';

@Component({
    selector: 'app-validate',
    templateUrl: './validate.component.html',
    styleUrls: ['./validate.component.scss']
})
export class ValidateComponent implements OnInit {

    ui = UI;

    space: Space;
    errors: ValidationError[] = [];

    constructor(private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.data.subscribe(({space}) => {
            this.errors = space.validate();
            this.space = space;
        });
    }

}
