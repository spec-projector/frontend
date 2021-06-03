import { Component, HostBinding, OnInit } from '@angular/core';
import { UI } from '@junte/ui';
import { animateChild, query, stagger, state, style, transition, trigger } from '@angular/animations';
import { fadeInKeyframes, moveKeyframes } from '../../animation';

@Component({
  selector: 'spec-lp-cost-features',
  templateUrl: './cost-features.component.html',
  styleUrls: ['./cost-features.component.scss'],
  animations: [
    trigger('animate', [
      transition(':enter', [
        fadeInKeyframes,
        query('@show', animateChild())
      ], {params: {duration: '1s', delay: '0s'}})
    ]),
    trigger('show', [
      state('void', style({transform: 'translate3D(0, 0, 0)'})),
      state('*', style({transform: 'translate3D(0, 400px, 0)'})),
      transition('void => *', [moveKeyframes], {params: {distance: '0,400px,0', duration: '5s'}})
    ])
  ]
})
export class CostFeaturesComponent implements OnInit {

  ui = UI;

  @HostBinding('@animate')
  animate = true;

  constructor() {
  }

  ngOnInit(): void {
  }

}
