import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { PopoverInstance, UI } from '@junte/ui';
import { filter } from 'rxjs/operators';
import { generate as shortid } from 'shortid';
import { Language } from 'src/enums/language';
import { LocalUI } from 'src/enums/local-ui';
import { Graphql } from 'src/models/spec/planning/graphql';
import { SpecManager } from '../../../managers';
import { Feature } from '../../../../../models/spec/planning/feature';

const GRAPHQL_TEXT = `
query ($id: ID) {
    cat(id: $id) {
        name
    }
}
`;

@Component({
  selector: 'spec-api',
  templateUrl: './feature-api.component.html',
  styleUrls: ['./feature-api.component.scss']
})
export class FeatureApiComponent implements OnInit {

  ui = UI;
  localUi = LocalUI;
  language = Language;

  feature: Feature;
  selected: { query: Graphql } = {query: null};
  instance: { popover: PopoverInstance } = {popover: null};

  constructor(public manager: SpecManager,
              public route: ActivatedRoute,
              public router: Router,
              @Inject(LOCALE_ID) public locale: string) {
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
        title: 'Some query',
        text: GRAPHQL_TEXT
      }));
    this.manager.put(this.feature);

    this.feature.version++;

    this.router.navigate(['graphql', id], {relativeTo: this.route})
      .then(() => null);
  }

}
