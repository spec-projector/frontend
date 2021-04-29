import { Component, OnInit } from '@angular/core';
import { UI } from '@junte/ui';
import { animateChild, transition, trigger } from '@angular/animations';
import { fadeInKeyframes } from '../../animation';

@Component({
  selector: 'spec-lp-user-stories',
  templateUrl: './user-stories.component.html',
  styleUrls: ['./user-stories.component.scss'],
  animations: [
    trigger('slide', [
      transition(':enter', [
        fadeInKeyframes,
        animateChild()
      ], {params: {duration: '1s'}}),
      transition(':leave', [
        animateChild()
      ])
    ])
  ]
})
export class UserStoriesComponent implements OnInit {

  ui = UI;

  constructor() {
  }

  ngOnInit(): void {
  }

}
