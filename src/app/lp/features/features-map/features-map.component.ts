import { Component, OnInit } from '@angular/core';
import { UI } from '@junte/ui';
import { animateChild, transition, trigger } from '@angular/animations';
import { fadeInKeyframes } from '../../animation';

enum Animation {
  manager = 'manager',
  client = 'client',
  carrier = 'carrier'
}

@Component({
  selector: 'spec-lp-features-map',
  templateUrl: './features-map.component.html',
  styleUrls: ['./features-map.component.scss'],
  animations: [
    trigger('slide', [
      transition(':enter', [
        fadeInKeyframes,
        animateChild()
      ], {params: {duration: '1s'}}),
      transition(':leave', [
        animateChild()
      ])
    ])
  ]
})
export class FeaturesMapComponent implements OnInit {

  ui = UI;
  animations = Animation;
  animation: Animation = Animation.client;

  constructor() {
  }

  ngOnInit(): void {
  }

}
