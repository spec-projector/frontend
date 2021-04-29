import { Component, EventEmitter, HostBinding, OnInit, Output } from '@angular/core';
import { UI } from '@junte/ui';
import { animateChild, group, query, sequence, state, style, transition, trigger } from '@angular/animations';
import { fadeMoveKeyframes, moveKeyframes, scaleKeyframes } from '../../../animation';

@Component({
  selector: 'spec-lp-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
  animations: [
    trigger('animate', [
      transition(':enter', [
        sequence([
          query('@fade-move', animateChild()),
          query('[data-rock]', animateChild()),
          query('@move', animateChild()),
          group([
            query('[data-flowers]', animateChild()),
            query('[data-think]', animateChild())
          ]),
          query('[data-bulb]', animateChild())
        ])
      ])
    ]),
    trigger('fade-move', [
      state('void', style({transform: 'translate(-50%, -50%)'})),
      state('*', style({transform: 'translate(-50%, -200px)'})),
      transition('void => *', fadeMoveKeyframes, {params: {duration: '.5s'}})
    ]),
    trigger('scale', [
      state('void', style({transform: 'scale(0)'})),
      state('*', style({transform: 'scale(1)'})),
      transition('void => *', scaleKeyframes, {params: {duration: '.3s'}})
    ]),
    trigger('move', [
      state('void', style({transform: 'translate(0, 0)'})),
      state('*', style({transform: 'translate(315px, 0)'})),
      transition('void => *', moveKeyframes, {params: {distance: '315px, 0, 0'}})
    ]),
  ]
})
export class ClientComponent implements OnInit {

  ui = UI;

  @HostBinding('@animate')
  animate = true;

  @Output() done = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

}
