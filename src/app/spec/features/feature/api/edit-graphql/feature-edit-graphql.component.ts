import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UI } from '@junte/ui';
import { NGXLogger } from 'ngx-logger';
import { Feature } from 'src/models/spec/planning/feature';
import { Graphql } from 'src/models/spec/planning/graphql';
import { SpecManager } from '../../../../../../managers/spec.manager';
import { generate as shortid } from 'shortid';

@Component({
  selector: 'spec-feature-edit-graphql',
  templateUrl: './feature-edit-graphql.component.html',
  styleUrls: ['./feature-edit-graphql.component.scss']
})
export class FeatureEditGraphqlComponent implements OnInit {

  ui = UI;

  private _query: Graphql;

  feature: Feature;

  textControl = this.fb.control(null, [Validators.required]);
  form = this.fb.group({
    title: [null, [Validators.required]],
    text: this.textControl
  });

  set query(query: Graphql) {
    this._query = query;
    this.form.patchValue({
      title: query.title,
      text: query.text
    });
  }

  get query() {
    return this._query;
  }

  constructor(public manager: SpecManager,
              private fb: FormBuilder,
              private logger: NGXLogger,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.route.data.subscribe(({feature, query}) => [this.feature,
      this.query] = [feature, query]);
  }

  save() {
    this.logger.log('save graphql for feature [', this.feature.title.toString(), ']');
    const {title, text} = this.form.getRawValue();
    Object.assign(this.query, {title, text});
    // TODO: remove this after filling id for query
    if (!this.query.id) {
      this.query.id = shortid();
    }
    this.manager.put(this.feature);
    this.feature.version++;

    this.router.navigate(['../..'], {relativeTo: this.route})
      .then(() => null);
  }

  delete() {
    const index = this.feature.graphql.findIndex(g => g.id === this.query.id);
    if (index === -1) {
      alert('Query not found');
      return;
    }
    this.feature.graphql.splice(index, 1);
    this.manager.put(this.feature);
    this.feature.version++;

    this.router.navigate(['../..'], {relativeTo: this.route})
      .then(() => null);
  }

}
