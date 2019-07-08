import {Component, OnInit} from '@angular/core';
import {UI} from 'junte-ui';
import {Space} from '../../model/space';
import {ValidationError} from '../../validation/error';
import {ActivatedRoute} from '@angular/router';
import {FormBuilder, FormControl} from "@angular/forms";
import {SpaceManager} from "../services/space-manager.service";
import {EditMode} from "../../enums/edit-mode";

@Component({
    selector: 'app-space',
    templateUrl: './space.component.html',
    styleUrls: ['./space.component.scss']
})
export class SpaceComponent implements OnInit {
    ui = UI;

    space: Space;
    errors: ValidationError[] = [];

    mode = new FormControl(false);

    form = this.formBuilder.group({
        mode: this.mode
    });

    constructor(public manager: SpaceManager,
                private formBuilder: FormBuilder,
                private route: ActivatedRoute) {
        this.mode.valueChanges.subscribe(mode =>
            this.manager.mode = mode ? EditMode.edit : EditMode.view);
    }

    ngOnInit() {
        this.route.data.subscribe(({space}) => this.space = space);
    }
}
