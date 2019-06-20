import { Component, OnInit } from '@angular/core';
import {Space} from '../../../model/space';
import {ActivatedRoute} from '@angular/router';
import {UI} from 'junte-ui';

@Component({
  selector: 'app-epics',
  templateUrl: './epics.component.html',
  styleUrls: ['./epics.component.scss']
})
export class EpicsComponent implements OnInit {

    ui = UI;

    space: Space;

    constructor(private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.data.subscribe(({space}) => this.space = space);
    }

}
