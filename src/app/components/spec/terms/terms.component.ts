import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EditMode } from 'src/app/model/enums/edit-mode';
import { UI } from 'junte-ui';
import { Spec } from 'src/app/model/spec/spec';

@Component({
    selector: 'spec-terms',
    templateUrl: './terms.component.html',
    styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {

    ui = UI;
    editMode = EditMode;

    mode = EditMode.view;
    spec: Spec;

    constructor(private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.data.subscribe(({spec}) => this.spec = spec);
    }

}
