import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { PopoverInstance, UI } from '@junte/ui';
import { filter } from 'rxjs/operators';
import { generate as shortid } from 'shortid';
import { LocalUI } from 'src/app/enums/local-ui';
import { Graphql } from 'src/app/model/spec/planning/graphql';
import { SpecManager } from '../../../../../managers/spec.manager';
import { Feature } from '../../../../../model/spec/planning/feature';

@Component({
  selector: 'spec-api',
  templateUrl: './feature-api.component.html',
  styleUrls: ['./feature-api.component.scss']
})
export class FeatureApiComponent implements OnInit {

  ui = UI;
  localUi = LocalUI;

  feature: Feature;
  selected: { query: Graphql } = {query: null};
  instance: { popover: PopoverInstance } = {popover: null};

  constructor(public manager: SpecManager,
              public route: ActivatedRoute,
              public router: Router) {
  }

  ngOnInit() {
    this.route.data.subscribe(({feature}) => this.feature = feature);

    this.router.events.pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.readState());
    this.readState();
  }

  readState() {
    const data = this.route.firstChild?.snapshot.data || {query: null};
    const {query} = data as { query: Graphql };
    this.selected.query = query;
  }

  addGraphQL() {
    this.instance.popover?.hide();

    const id = shortid();
    this.feature.graphql.push(new Graphql(
      {
        id: id,
        title: 'Some query'
      }));
    this.manager.put(this.feature);

    this.feature.version++;

    this.router.navigate(['graphql', id], {relativeTo: this.route})
      .then(() => null);
  }

}
