import { Component, HostBinding, HostListener } from '@angular/core';
import { UI } from '@junte/ui';
import 'reflect-metadata';
import { ActivatedRoute, Router } from '@angular/router';
import { animate, animateChild, group, keyframes, query, state, style, transition, trigger } from '@angular/animations';
import { Distance, moveKeyframes } from './animation';

const HAND_DISTANCE = '-77px, 23px, 0';
const HAND_ROTATE = '20deg';

@Component({
  selector: 'spec-lp',
  templateUrl: './lp.component.html',
  styleUrls: ['./lp.component.scss'],
  animations: [
    trigger('move', [
      transition('* => void', moveKeyframes, {params: {distance: '0,0,0'}})
    ]),
    trigger('move-hand', [
      state('void', style({transform: 'translate3D(0, 0, 0) rotate({{handRotate}})'}),
        {params: {handRotate: HAND_ROTATE}}),
      state('*', style({transform: 'translate3D({{handDistance}}) rotate(0)'}),
        {params: {handDistance: HAND_DISTANCE}}),
      transition('void => *',
        group([
          animate('{{delay}}s {{enterTiming}}s ease', keyframes([
            style({transform: 'translate3D({{handDistance}}) rotate(0)'})
          ])),
          query('@coloring', animateChild(), {optional: true}),
        ]), {params: {handDistance: HAND_DISTANCE, delay: '1', enterTiming: '.5'}}),
      transition('* => void', [])
    ]),
    trigger('coloring', [
      state('void', style({color: '{{startColor}}'}), {params: {startColor: '#FD5C02'}}),
      state('*', style({color: '{{endColor}}'}), {params: {endColor: '#3949AB'}}),
      transition('void => *', animate('{{delay}}s {{enterTiming}}s ease'),
        {params: {delay: '1', enterTiming: '.5'}}),
      transition('* => void', [])
    ])
  ]
})

export class LpComponent {

  ui = UI;
  distance = Distance;

  @HostBinding('attr.data-scrolled')
  scrolled = false;

  constructor(public route: ActivatedRoute,
              public router: Router) {
  }

  @HostListener('window:scroll', ['event'])
  onPageScroll() {
    const offset = window.pageYOffset
      || document.documentElement.scrollTop
      || document.body.scrollTop || 0;
    this.scrolled = offset > 0;
  }

}
