import { Component, HostBinding, ViewChild } from '@angular/core';
import { UI } from '@junte/ui';
import { animate, animateChild, group, keyframes, query, style, transition, trigger } from '@angular/animations';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('routeAnimations', [
      transition('lp => login, lp => register, register <=> login', [
        group([
          query(':leave', [
            animate('.8s ease-in-out', keyframes([
              style({opacity: '1'}),
              style({opacity: '0'})
            ]))
          ]),
          query(':enter', [
            animate('.8s ease-in-out', keyframes([
              style({opacity: '0'}),
              style({opacity: '1'})
            ]))
          ]),
          query('@move', animateChild(), {optional: true}),
        ]),
      ])
    ])
  ]
})
export class AppComponent {

  ui = UI;

  @ViewChild('outlet')
  outlet: RouterOutlet;

  @HostBinding('@routeAnimations')
  get getRouteAnimations() {
    return this.outlet && this.outlet.activatedRouteData && this.outlet.activatedRouteData.animation;
  }
}
