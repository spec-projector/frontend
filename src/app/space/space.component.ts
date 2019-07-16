import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SpaceManager } from 'src/app/services/space-manager.service';
import { EditMode } from 'src/enums/edit-mode';
import { UI } from 'junte-ui';
import { Space } from 'src/model/space';
import { ValidationError } from 'src/validation/error';

@Component({
    selector: 'app-space',
    templateUrl: './space.component.html',
    styleUrls: ['./space.component.scss']
})
export class SpaceComponent implements OnInit {
    ui = UI;

    space: Space;
    errors: ValidationError[] = [];
    mode = new FormControl(true);
    form = this.formBuilder.group({mode: this.mode});

    constructor(public manager: SpaceManager,
                private formBuilder: FormBuilder,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.data.subscribe(({space}) => this.space = space);
        this.manager.mode = this.mode.value ? EditMode.edit : EditMode.view;
        this.mode.valueChanges.subscribe(mode => this.manager.mode = mode ? EditMode.edit : EditMode.view);
    }
}
