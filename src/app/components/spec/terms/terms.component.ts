import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpecManager } from 'src/app/managers/spec.manager';
import { EditMode } from 'src/app/model/enums/edit-mode';
import { UI } from 'junte-ui';
import { Epic } from "src/app/model/spec/planning/epic";
import { Term } from "src/app/model/spec/planning/term";
import { TextToken } from "src/app/model/spec/planning/token";
import { Spec } from 'src/app/model/spec/spec';
import * as uuid from 'uuid/v1';

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

    constructor(public manager: SpecManager,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.data.subscribe(({spec}) => this.spec = spec);
    }

    addTerm() {
        const term = new Term({
            id: uuid(),
            name: 'Some term',
            description: [new TextToken('description...')]
        });
        this.spec.terms.unshift(term);

        this.manager.put(term);
        this.manager.put(this.spec);
    }

}
