import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UI } from 'junte-ui';
import { Sprint } from 'src/model/planning/sprint';

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