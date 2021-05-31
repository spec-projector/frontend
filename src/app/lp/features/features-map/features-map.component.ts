import { Component, HostBinding, OnInit } from '@angular/core';
import { UI } from '@junte/ui';
import { animateChild, group, query, sequence, stagger, state, style, transition, trigger } from '@angular/animations';
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
        fadeInKeyframes,
        query(':enter', fadeInKeyframes, {params: {duration: '.5s', delay: '0s'}}),
        query(':leave', fadeOutKeyframes, {params: {duration: '.5s', delay: '0s'}, optional: true}),
        query('@slide', fadeOutKeyframes, {params: {duration: '.5s', delay: '0s'}, optional: true}),
        query('@done', stagger('.8s', animateChild()), {delay: '.6s'}),
      ], {params: {duration: '.5s', delay: '0s'}})
    ]),
    trigger('slide', [
      transition(':enter, :leave', [animateChild()])
    ]),
    trigger('done', [
      state('void', style({opacity: '1'})),
      state('*', style({opacity: '0'})),
      transition('void => *', fadeOutKeyframes, {params: {duration: '.5s', delay: '0s'}})
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
