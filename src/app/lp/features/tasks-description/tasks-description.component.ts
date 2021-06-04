import { Component, HostBinding, OnInit } from '@angular/core';
import { UI } from '@junte/ui';
import { animateChild, query, state, style, transition, trigger } from '@angular/animations';
import { fadeInKeyframes, scaleKeyframes } from '../../animation';

@Component({
  selector: 'spec-lp-tasks-description',
  templateUrl: './tasks-description.component.html',
  styleUrls: ['./tasks-description.component.scss'],
  animations: [
    trigger('animate', [
      transition(':enter', [
        fadeInKeyframes,
        query('@show', animateChild())
      ], {params: {duration: '1s', delay: '0s'}})
    ]),
    trigger('show', [
      state('void', style({transform: 'scale(0)', transformOrigin: 'center'})),
      state('*', style({transform: 'scale(1)'})),
      transition('void => *', [scaleKeyframes], {params: {duration: '.5s', delay: '0s'}})
    ])
  ]
})
export class TasksDescriptionComponent implements OnInit {

  ui = UI;

  @HostBinding('@animate')
  animate = true;

  constructor() {
  }

  ngOnInit(): void {
  }

}
