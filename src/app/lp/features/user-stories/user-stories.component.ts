import { Component, OnInit } from '@angular/core';
import { UI } from '@junte/ui';

@Component({
  selector: 'spec-lp-user-stories',
  templateUrl: './user-stories.component.html',
  styleUrls: ['./user-stories.component.scss']
})
export class UserStoriesComponent implements OnInit {

  ui = UI;

  constructor() { }

  ngOnInit(): void {
  }

}
