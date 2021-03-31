import { state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import 'reflect-metadata';
import { UI } from '@junte/ui';
import { Distance, moveKeyframes } from '../lp/animation';

@Component({
  selector: 'spec-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  animations: [
    trigger('move', [
      state('*', style({transform: 'translate3D({{distance}})'}), {params: {distance: '0,0,0'}}),
      transition('void => *', moveKeyframes, {params: {distance: '0,0,0'}}),
    ])
  ]
})
export class ResetPasswordComponent {

  ui = UI;
  distance = Distance;

}
