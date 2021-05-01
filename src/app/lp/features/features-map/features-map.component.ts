import { Component, OnInit } from '@angular/core';
import { UI } from '@junte/ui';
import { animateChild, transition, trigger } from '@angular/animations';

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
      transition(':enter, :leave', [animateChild()])
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
