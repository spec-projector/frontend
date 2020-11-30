import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UI } from '@junte/ui';
import { Spec } from 'src/app/model/spec/spec';

@Component({
    selector: 'spec-sprints',
    templateUrl: './sprints.component.html',
    styleUrls: ['./sprints.component.scss']
})
export class SprintsComponent implements OnInit {

    ui = UI;

    spec: Spec;

    constructor(private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.data.subscribe(({spec}) => this.spec = spec);
    }

}
