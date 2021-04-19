import { Component } from '@angular/core';
import { UI } from '@junte/ui';
import { animate, animateChild, group, query, state, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';

enum Feature {
  cleanWorkflow,
  featuresMap,
  userStories,
  attachDesign,
  costFeatures,
  tasksDescription,
  printContract
}

@Component({
  selector: 'spec-lp-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss'],
  animations: [
    trigger('changeView', [
      state('short', style({height: '25px'})),
      state('extend', style({height: '135px'})),
      transition('short <=> extend', group([
        animate('.5s ease'),
        query('@fadeOut', animateChild(), {optional: true}),
        query('@fadeIn', animateChild(), {optional: true})
      ]))
    ]),
    trigger('fadeIn', [
      state('void', style({opacity: 0})),
      state('*', style({opacity: 1})),
      transition('void => *', animate('.5s ease'))
    ]),
    trigger('fadeOut', [
      state('void', style({opacity: 0})),
      state('*', style({opacity: 1})),
      transition('* => void', animate('.5s ease'))
    ])
  ]
})
export class FeaturesComponent {

  ui = UI;
  features = Feature;
  feature: Feature = Feature.cleanWorkflow;

  constructor(public route: ActivatedRoute,
              public router: Router) {
  }

  setActive(feature: Feature) {
    if (this.feature === feature) {
        this.feature = null;
    } else {
      this.feature = feature;
    }
  }

}
