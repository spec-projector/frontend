import { Component, EventEmitter, HostBinding, OnInit, Output } from '@angular/core';
import { UI } from '@junte/ui';
import { animateChild, group, query, sequence, stagger, state, style, transition, trigger } from '@angular/animations';
import { fadeInKeyframes, fadeMoveKeyframes, fadeOutKeyframes, moveKeyframes, scaleKeyframes } from '../../../animation';

@Component({
  selector: 'spec-lp-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
  animations: [
    trigger('animate', [
      transition(':enter', [
        fadeInKeyframes,
        sequence([
          query('@fade-move', animateChild()),
          query('[data-rock]', animateChild()),
          query('@move', animateChild(), {delay: '.2s'}),
          group([
            query('[data-flowers]', animateChild(), {delay: '.2s'}),
            query('[data-think]', animateChild(), {delay: '.2s'})
          ]),
          query('[data-bulb]', animateChild(), {delay: '.2s'}),
          query('@moveList', stagger('.8s', animateChild()), {delay: '.2s'}),
        ])
      ], {params: {duration: '1s', delay: '0s'}}),
      transition(':leave', [
        fadeOutKeyframes
      ], {params: {duration: '.5s'}})
    ]),
    trigger('fade-move', [
      state('void', style({transform: 'translate(-50%, -50%)'})),
      state('*', style({transform: 'translate(-50%, -200px)'})),
      transition('void => *', fadeMoveKeyframes, {params: {duration: '.5s', delay: '0s'}})
    ]),
    trigger('scale', [
      state('void', style({transform: 'scale(0)'})),
      state('*', style({transform: 'scale(1)'})),
      transition('void => *', scaleKeyframes, {params: {duration: '.3s', delay: '0s'}})
    ]),
    trigger('move', [
      state('void', style({transform: 'translate(0, 0)'})),
      state('*', style({transform: 'translate({{stateEnd}})'}), {params: {stateEnd: '0, 0'}}),
      transition('void => *', moveKeyframes, {params: {distance: '0, 0, 0'}})
    ]),
    trigger('moveList', [
      state('void', style({transform: 'translate(0, 0)'})),
      state('*', style({transform: 'translate(-480px, 0)'})),
      transition('void => *', moveKeyframes, {params: {distance: '-480px, 0, 0'}})
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
