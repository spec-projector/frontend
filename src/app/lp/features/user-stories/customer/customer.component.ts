import { Component, HostBinding, OnInit } from '@angular/core';
import { UI } from '@junte/ui';
import { animate, animateChild, group, keyframes, query, sequence, stagger, state, style, transition, trigger } from '@angular/animations';
import { fadeInKeyframes, fadeMoveKeyframes, fadeOutKeyframes } from '../../../animation';

@Component({
  selector: 'spec-lp-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
  animations: [
    trigger('animate', [
      transition(':enter', [
        fadeInKeyframes,
        group([
          query('@fade-move', animateChild()),
          sequence([
            query('@move', animateChild()),
            sequence([
              query('@expansion', animateChild()),
              query('@fadeIn', stagger('.5s', animateChild())),
            ])
          ])
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
    trigger('fadeIn', [
      state('void', style({opacity: '0'})),
      state('*', style({opacity: '1'})),
      transition('void => *', fadeInKeyframes, {params: {duration: '.2s'}})
    ]),
    trigger('move', [
      state('void', style({transform: 'translate3D(0, 0, 0)', opacity: '0'})),
      state('*', style({transform: 'translate3D(0, -300px, 0)', opacity: '1'})),
      transition('void => *', animate('.6s 1s ease', keyframes([
        style({transform: 'translate3D(0, 0, 0)', opacity: '0'}),
        style({transform: 'translate3D({{distance}})', opacity: '1'})
      ])), {params: {distance: '0,0,0'}})
    ]),
    trigger('expansion', [
      state('void', style({width: '50px'})),
      state('*', style({width: '520px'})),
      transition('void => *', sequence([
          animate('1s ease', keyframes([
            style({width: '50px'}),
            style({width: '520px'})
          ])),
          animate('1s ease', keyframes([
            style({height: '70px'}),
            style({height: '*'})
          ]))
        ])
      )
    ])
  ]
})
export class CustomerComponent implements OnInit {

  ui = UI;

  @HostBinding('@animate')
  animate = true;

  constructor() {
  }

  ngOnInit(): void {
  }

}
