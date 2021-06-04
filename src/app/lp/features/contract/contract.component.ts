import { Component, HostBinding, OnInit } from '@angular/core';
import { UI } from '@junte/ui';
import { animateChild, query, state, style, transition, trigger } from '@angular/animations';
import { fadeInKeyframes, scaleKeyframes } from '../../animation';

@Component({
  selector: 'spec-lp-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss'],
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
export class ContractComponent implements OnInit {

  ui = UI;

  @HostBinding('@animate')
  animate = true;

  constructor() {
  }

  ngOnInit(): void {
  }

}
