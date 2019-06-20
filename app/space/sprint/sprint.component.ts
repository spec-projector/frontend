import {Component, OnInit} from '@angular/core';
import {UI} from 'junte-ui';
import {ActivatedRoute} from '@angular/router';
import {Sprint} from '../../../model/planning/sprint';

@Component({
    selector: 'app-sprint',
    templateUrl: './sprint.component.html',
    styleUrls: ['./sprint.component.css']
})
export class SprintComponent implements OnInit {

    ui = UI;

    sprint: Sprint;

    constructor(private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.data.subscribe(({sprint}) => this.sprint = sprint);
    }

}
