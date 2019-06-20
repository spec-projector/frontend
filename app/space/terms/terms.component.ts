import {Component, OnInit} from '@angular/core';
import {Space} from '../../../model/space';
import {ActivatedRoute} from '@angular/router';
import {UI} from 'junte-ui';
import {EditMode} from '../../../types/edit-mode';

@Component({
    selector: 'app-terms',
    templateUrl: './terms.component.html',
    styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {

    ui = UI;
    editMode = EditMode;

    mode = EditMode.normal;
    space: Space;

    constructor(private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.data.subscribe(({space}) => this.space = space);
    }

}
