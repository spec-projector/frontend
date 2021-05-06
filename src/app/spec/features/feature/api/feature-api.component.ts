import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {PopoverInstance, UI} from '@junte/ui';
import {filter} from 'rxjs/operators';
import {Language} from 'src/enums/language';
import {LocalUI} from 'src/enums/local-ui';
import {Graphql} from 'src/models/spec/planning/feature/graphql';
import {CURRENT_LANGUAGE} from '../../../../../consts';
import {EditMode} from '../../../../../enums/edit-mode';
import {Feature} from '../../../../../models/spec/planning/feature/feature';
import {SpecManager} from '../../../managers';

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
  editMode = EditMode;
  consts = {language: CURRENT_LANGUAGE};

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

    const {api} = this.feature;
    const graphql = new Graphql(
      {
        title: 'Some query',
        text: GRAPHQL_TEXT
      });
    graphql.new();
    this.manager.put(graphql);

    api.addGraphql(graphql);
    this.manager.put(api);

    this.feature.version++;

    this.router.navigate(['graphql', graphql.id],
      {
        relativeTo: this.route,
        fragment: 'api'
      }).then(() => null);
  }

  deleteGraphQL(query: Graphql) {
    const {api} = this.feature;
    api.removeGraphql(query);
    this.feature.version++;
    this.manager.put(api);

    if (this.selected.query === query) {
      this.router.navigate(['./'], {
        relativeTo: this.route,
        fragment: 'api'
      })
        .then(() => null);
    }
  }

}
