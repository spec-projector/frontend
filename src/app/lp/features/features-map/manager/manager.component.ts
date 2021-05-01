import { Component, EventEmitter, HostBinding, OnInit, Output } from '@angular/core';
import { UI } from '@junte/ui';
import { animateChild, query, sequence, stagger, state, style, transition, trigger } from '@angular/animations';
import { fadeInKeyframes, fadeMoveKeyframes, fadeOutKeyframes, moveKeyframes, scaleKeyframes } from '../../../animation';

@Component({
  selector: 'spec-lp-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss'],
  animations: [
    trigger('animate', [
      transition(':enter', [
        fadeInKeyframes,
        sequence([
          query('@fade-move', animateChild()),
          query('[data-rock]', animateChild(), {delay: '.2s'}),
          query('[data-manager]', animateChild(), {delay: '.2s'}),
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
    trigger('moveList', [
      state('void', style({transform: 'translate(0, 0)'})),
      state('*', style({transform: 'translate(310px, 0)'})),
      transition('void => *', moveKeyframes, {params: {distance: '310px, 0, 0'}})
    ]),
  ]
})
export class ManagerComponent implements OnInit {

  ui = UI;

  @HostBinding('@animate')
  animate = true;

  @Output() done = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

}
