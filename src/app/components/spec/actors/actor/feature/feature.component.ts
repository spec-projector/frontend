import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Feature } from '../../../../../model/spec/planning/feature';

@Component({
  selector: 'spec-actor-feature',
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.scss']
})
export class ActorFeatureComponent implements OnInit {

  feature: Feature;

  constructor(private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.route.data.subscribe(({feature}) => this.feature = feature);
  }


}
