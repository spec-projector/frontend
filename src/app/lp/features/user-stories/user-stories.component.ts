import { Component, OnInit } from '@angular/core';
import { UI } from '@junte/ui';
import { animateChild, transition, trigger } from '@angular/animations';

@Component({
  selector: 'spec-lp-user-stories',
  templateUrl: './user-stories.component.html',
  styleUrls: ['./user-stories.component.scss'],
  animations: [
    trigger('slide', [
      transition(':enter, :leave', [animateChild()])
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
