import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UI } from 'junte-ui';
import { NGXLogger } from 'ngx-logger';
import { Feature } from 'src/app/model/spec/planning/feature';
import { Graphql } from 'src/app/model/spec/planning/graphql';
import { SpecManager } from '../../../../../managers/spec.manager';

@Component({
  selector: 'spec-feature-edit-graphql',
  templateUrl: './feature-edit-graphql.component.html',
  styleUrls: ['./feature-edit-graphql.component.scss']
})
export class FeatureEditGraphqlComponent implements OnInit {

  ui = UI;

  private _index: number;

  feature: Feature;

  textControl = this.fb.control(null, [Validators.required]);
  form = this.fb.group({
    title: [null, [Validators.required]],
    text: this.textControl
  });

  set index(index: number) {
    this._index = index;
    this.query = this.feature.graphql[index];
  }

  get index() {
    return this._index;
  }

  set query(query: Graphql) {
    this.form.patchValue({
      title: query.title,
      text: query.text
    });
  }

  constructor(public manager: SpecManager,
              private fb: FormBuilder,
              private logger: NGXLogger,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.route.data.subscribe(({feature, index}) => [this.feature, this.index] = [feature, index]);
  }

  save() {
    this.logger.log('save graphql for feature [', this.feature.title.toString(), ']');
    const {title, text} = this.form.getRawValue();
    this.feature.graphql[this.index] = new Graphql({title, text});
    this.manager.put(this.feature);

    this.feature.version++;

    this.router.navigate(['../..'], {relativeTo: this.route})
      .then(() => null);
  }

  delete() {
    this.feature.graphql.splice(this.index, 1);
    this.manager.put(this.feature);
    this.feature.version++;

    this.router.navigate(['../..'], {relativeTo: this.route})
      .then(() => null);
  }

}
