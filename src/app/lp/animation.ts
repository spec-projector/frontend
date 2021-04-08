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
  plus = '-190px, -200px, 0px',
  torusSmall = '380px, -290px, 0px',
  figma = '-435px, -100px, 0px',
  torusBig = '215px, -445px, 0px',
  handUp = '0, calc(-100vh + 730px), 0',
  handOk = '0, calc(-100vh + 550px), 0'
}
