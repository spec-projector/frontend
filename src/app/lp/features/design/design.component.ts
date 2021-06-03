import { Component, HostBinding, OnInit } from '@angular/core';
import { UI } from '@junte/ui';
import { animateChild, query, stagger, state, style, transition, trigger } from '@angular/animations';
import { fadeInKeyframes, fadeOutKeyframes } from '../../animation';

@Component({
  selector: 'spec-lp-design',
  templateUrl: './design.component.html',
  styleUrls: ['./design.component.scss'],
  animations: [
    trigger('animate', [
      transition(':enter', [
        fadeInKeyframes,
        query('@show', stagger('.8s', animateChild()), {delay: '.5s'})
      ], {params: {duration: '1s', delay: '0s'}})
    ]),
    trigger('show', [
      state('void', style({opacity: '1'})),
      state('*', style({opacity: '0'})),
      transition('void => *', [fadeOutKeyframes], {params: {duration: '.5s', delay: '0s'}})
    ])
  ]
})
export class DesignComponent implements OnInit {

  ui = UI;

  @HostBinding('@animate')
  animate = true;

  constructor() {
  }

  ngOnInit(): void {
  }

}
