import { Component, HostBinding, OnInit } from '@angular/core';
import { UI } from '@junte/ui';
import { animateChild, query, stagger, state, style, transition, trigger } from '@angular/animations';
import { fadeInKeyframes, fadeOutKeyframes } from '../../animation';

enum Animation {
  manager = 'manager',
  client = 'client',
  carrier = 'carrier',
  operator = 'operator'
}

@Component({
  selector: 'spec-lp-features-map',
  templateUrl: './features-map.component.html',
  styleUrls: ['./features-map.component.scss'],
  animations: [
    trigger('animate', [
      transition(':enter', [
        query('@slide', animateChild(), {delay: '1s', optional: true})
      ])
    ]),
    trigger('slide', [
      transition(':enter', [
        fadeInKeyframes,
        query('@done', stagger('.8s', animateChild()), {delay: '.6s', optional: true})
      ], {params: {duration: '2s', delay: '0s'}}),
      transition(':leave', [
        fadeOutKeyframes
      ], {params: {duration: '2s', delay: '0s'}}),
    ]),
    trigger('done', [
      state('void', style({opacity: '1'})),
      state('*', style({opacity: '0'})),
      transition('void => *', fadeOutKeyframes, {params: {duration: '.5s', delay: '.5s'}})
    ]),
  ]
})
export class FeaturesMapComponent implements OnInit {

  ui = UI;
  animations = Animation;

  @HostBinding('@animate')
  animate = true;

  animation: Animation = Animation.client;

  constructor() {
  }

  ngOnInit(): void {
  }

}
