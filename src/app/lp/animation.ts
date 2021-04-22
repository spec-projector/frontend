import { animate, keyframes, style } from '@angular/animations';

export const moveKeyframes = animate('.5s ease', keyframes([
  style({transform: 'translate3D(0, 0, 0)'}),
  style({transform: 'translate3D({{distance}})'})
]));

export const moveDownKeyframes = animate('.5s ease', keyframes([
  style({transform: 'translate3D({{distance}})'}),
  style({transform: 'translate3D(0, 0, 0)'})
]));

export enum Distance {
  torusHalf = '-470px, -230px, 0px',
  torusSmall = '500px, -400px, 0px',
  figma = '-310px, -230px, 0px',
  torusBig = '250px, -550px, 0px',
  handUp = '0, calc(-100vh + 770px), 0'
}
