import { animate, keyframes, sequence, style } from '@angular/animations';

export const moveKeyframes = animate('.5s ease', keyframes([
  style({transform: 'translate3D(0, 0, 0)'}),
  style({transform: 'translate3D({{distance}})'})
]));

export const moveDownKeyframes = animate('.5s ease', keyframes([
  style({transform: 'translate3D({{distance}})'}),
  style({transform: 'translate3D(0, 0, 0)'})
]));

export const fadeInKeyframes = animate('{{duration}} {{delay}} ease', keyframes([
  style({opacity: '0'}),
  style({opacity: '1'})
]));

export const fadeOutKeyframes = animate('{{duration}} {{delay}} ease', keyframes([
  style({opacity: '1'}),
  style({opacity: '0'})
]));

export const fadeMoveKeyframes = sequence([
    fadeInKeyframes,
    animate('.6s ease', keyframes([
      style({transform: 'translate(-50%, -50%)'}),
      style({transform: 'translate(-50%, -200px)'})
    ])),
  ]
);

export const scaleKeyframes = animate('{{duration}} {{delay}} ease', keyframes([
    style({transform: 'scale(0)'}),
    style({transform: 'scale(1)'})
  ]),
);

export enum Distance {
  torusHalf = '-470px, -230px, 0px',
  torusSmall = '500px, -400px, 0px',
  figma = '-310px, -230px, 0px',
  torusBig = '250px, -550px, 0px',
  handUp = '0, calc(-100vh + 770px), 0'
}
