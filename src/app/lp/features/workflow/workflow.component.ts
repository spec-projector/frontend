import { Component, HostBinding, OnInit } from '@angular/core';
import { UI } from '@junte/ui';
import { animate, animateChild, group, keyframes, query, sequence, stagger, state, style, transition, trigger } from '@angular/animations';
import { fadeInKeyframes } from '../../animation';

@Component({
  selector: 'spec-lp-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss'],
  animations: [
    trigger('animate', [
      transition(':enter', [
        fadeInKeyframes,
        group([
          query('@done', stagger('1s', animateChild()), {delay: '.6s'}),
          sequence([
            query('@move', animateChild()),
            query('@fade-rotate', animateChild()),
          ])
        ])
      ], {params: {duration: '.5s', delay: '0s'}})
    ]),
    trigger('move', [
      state('*', style({x: '165', y: '365'})),
      transition('void => *', animate('7s linear', keyframes([
        style({x: '165', y: '5'}),
        style({x: '165', y: '5'}),
        style({x: '365', y: '5'}),
        style({x: '365', y: '5'}),
        style({x: '560', y: '5'}),
        style({x: '560', y: '5'}),
        style({x: '560', y: '185'}),
        style({x: '560', y: '185'}),
        style({x: '560', y: '365'}),
        style({x: '560', y: '365'}),
        style({x: '365', y: '365'}),
        style({x: '365', y: '365'}),
        style({x: '165', y: '365'}),
        style({x: '165', y: '365'}),
      ])))
    ]),
    trigger('done', [
      state('void', style({opacity: '0'})),
      state('*', style({opacity: '1'})),
      transition('void => *', fadeInKeyframes, {params: {duration: '.5s', delay: '0s'}})
    ]),
    trigger('fade-rotate', [
      state('void', style({opacity: '0', transform: 'rotate(0) scale(1.5) translateX(0)', transformOrigin: 'center'})),
      state('*', style({opacity: '1', transform: 'rotate(360deg) scale(1) translateX(0)', transformOrigin: 'center'})),
      transition('void => *', group([
        fadeInKeyframes,
        animate('5s .8s linear', keyframes([
          style({transform: 'rotate(0) scale(1.5) translateX(0)'}),
          style({transform: 'rotate(360deg) scale(1.5) translateX(-10%)'}),
          style({transform: 'rotate(360deg) scale(1.5) translateX(-16%)'}),
          style({transform: 'rotate(360deg) scale(1.5) translateX(16%)'}),
          style({transform: 'rotate(360deg) scale(1) translateX(0)'})
        ]))
      ]), {params: {duration: '1.5s', delay: '.8s'}})
    ]),
  ]
})
export class WorkflowComponent implements OnInit {

  ui = UI;

  @HostBinding('@animate')
  animate = true;

  constructor() {
  }

  ngOnInit(): void {
  }

}
