import { Component, EventEmitter, HostBinding, OnInit } from '@angular/core';
import { UI } from '@junte/ui';
import { animateChild, query, sequence, stagger, state, style, transition, trigger } from '@angular/animations';
import { fadeInKeyframes, fadeMoveKeyframes, fadeOutKeyframes, moveKeyframes, scaleKeyframes } from '../../../animation';

@Component({
  selector: 'spec-lp-currier',
  templateUrl: './carrier.component.html',
  styleUrls: ['./currier.component.scss'],
  animations: [
    trigger('animate', [
      transition(':enter', [
        fadeInKeyframes,
        sequence([
          query('@fade-move', animateChild()),
          query('[data-rock]', animateChild(), {delay: '.2s'}),
          query('[data-carrier]', animateChild(), {delay: '.2s'}),
          query('[data-clock]', animateChild(), {delay: '.2s'}),
          query('@moveList', stagger('.8s', animateChild()), {delay: '.2s'}),
        ])
      ], {params: {duration: '1s'}}),
      transition(':leave', [
        fadeOutKeyframes
      ], {params: {duration: '.5s'}})
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
      state('*', style({transform: 'translate(0, -350px)'})),
      transition('void => *', moveKeyframes, {params: {distance: '0, -350px, 0'}})
    ]),
    trigger('moveList', [
      state('void', style({transform: 'translate(0, 0)'})),
      state('*', style({transform: 'translate(330px, 0)'})),
      transition('void => *', moveKeyframes, {params: {distance: '330px, 0, 0'}})
    ]),
  ]
})
export class CurrierComponent implements OnInit {

  ui = UI;

  @HostBinding('@animate')
  animate = true;

  constructor() {
  }

  ngOnInit(): void {
  }

}
