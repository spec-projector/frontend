import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EditMode } from 'src/enums/edit-mode';
import { UI } from 'junte-ui';
import { Space } from 'src/model/space';

@Component({
    selector: 'app-terms',
    templateUrl: './terms.component.html',
    styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {

    ui = UI;
    editMode = EditMode;

    mode = EditMode.view;
    space: Space;

    constructor(private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.data.subscribe(({space}) => this.space = space);
    }

}
