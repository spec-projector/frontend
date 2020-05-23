import { Component, ComponentFactoryResolver, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService, PopoverService, UI } from 'junte-ui';
import { LocalUI } from 'src/app/enums/local-ui';
import { Graphql } from 'src/app/model/spec/planning/graphql';
import { SpecManager } from '../../../../managers/spec.manager';
import { Feature } from '../../../../model/spec/planning/feature';

@Component({
  selector: 'spec-api',
  templateUrl: './feature-api.component.html',
  styleUrls: ['./feature-api.component.scss']
})
export class FeatureApiComponent implements OnInit {

  ui = UI;
  localUi = LocalUI;

  feature: Feature;

  constructor(public manager: SpecManager,
              private popover: PopoverService,
              private injector: Injector,
              private cfr: ComponentFactoryResolver,
              private modal: ModalService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.route.data.subscribe(({feature}) => this.feature = feature);
  }

  addGraphQL() {
    this.feature.graphql.push(new Graphql({title: 'Some query'}));
    this.manager.put(this.feature);

    this.feature.version++;

    this.router.navigate(['graphql', this.feature.graphql.length - 1],
      {relativeTo: this.route})
      .then(() => null);
  }

}
