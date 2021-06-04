import { Component, HostBinding, OnInit } from '@angular/core';
import { UI } from '@junte/ui';
import { animateChild, query, state, style, transition, trigger } from '@angular/animations';
import { fadeInKeyframes, moveKeyframes } from '../../animation';

@Component({
  selector: 'spec-lp-user-stories',
  templateUrl: './user-stories.component.html',
  styleUrls: ['./user-stories.component.scss'],
  animations: [
    trigger('animate', [
      transition(':enter', [
        fadeInKeyframes,
        query('@show', animateChild(), {delay: '.5s'})
      ], {params: {duration: '1s', delay: '0s'}})
    ]),
    trigger('show', [
      state('void', style({transform: 'translate3D(0, 0, 0)'})),
      state('*', style({transform: 'translate3D(0, 352px, 0)'})),
      transition('void => *', [moveKeyframes], {params: {distance: '0,352px,0', duration: '8s'}})
    ])
  ]
})
export class UserStoriesComponent implements OnInit {

  ui = UI;

  @HostBinding('@animate')
  animate = true;

  constructor() {
  }

  ngOnInit(): void {
  }

}
