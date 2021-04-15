import { animate, animateChild, group, keyframes, query, state, style, transition, trigger } from '@angular/animations';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UI } from '@junte/ui';
import 'reflect-metadata';
import { Language } from '../../enums/language';
import { LocalUI } from '../../enums/local-ui';
import { Tariff } from '../../models/tariffs';
import { MeUser } from '../../models/user';
import { AppConfig } from '../app-config';
import { Distance, moveKeyframes } from './animation';

const HAND_DISTANCE = '-77px, 23px, 0';
const HAND_ROTATE = '20deg';
const COOKIE_AGREEMENT_KEY = 'cookie_agreement';

@Component({
  selector: 'spec-lp',
  templateUrl: './lp.component.html',
  styleUrls: ['./lp.component.scss'],
  animations: [
    trigger('move', [
      transition('* => void', moveKeyframes, {params: {distance: '0,0,0'}})
    ]),
    trigger('moveHand', [
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

export class LpComponent implements OnInit {

  ui = UI;
  localUi = LocalUI;
  distance = Distance;
  language = Language;
  _cookie = localStorage[COOKIE_AGREEMENT_KEY] || false;

  set cookie(cookie: boolean) {
    this._cookie = cookie;
    localStorage.setItem(COOKIE_AGREEMENT_KEY, cookie ? 'yes' : '');
  }

  get cookie() {
    return this._cookie;
  }

  me: MeUser;

  constructor(@Inject(LOCALE_ID) public locale: string,
              private config: AppConfig,
              private route: ActivatedRoute,
              public router: Router) {
  }

  ngOnInit() {
    this.route.data.subscribe(({me}) => this.me = me);
  }

  jumpTo(fragment: string) {
    this.router.navigate([], {fragment});
  }

  buy(tariff: Tariff) {
    this.router.navigate([this.config.token ? '/subscription'
      : '/register', {tariff: tariff.id}])
      .then(() => null);
  }

}
