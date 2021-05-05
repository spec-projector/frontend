import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormComponent, UI } from '@junte/ui';
import { NGXLogger } from 'ngx-logger';
import { Feature } from 'src/models/spec/planning/feature/feature';
import { Graphql } from 'src/models/spec/planning/feature/graphql';
import { SpecManager } from '../../../../managers';

@Component({
  selector: 'spec-feature-edit-graphql',
  templateUrl: './feature-edit-graphql.component.html',
  styleUrls: ['./feature-edit-graphql.component.scss']
})
export class FeatureEditGraphqlComponent implements OnInit {

  ui = UI;

  private _query: Graphql;

  feature: Feature;

  form = this.fb.group({
    title: [null, [Validators.required]],
    text: [null, [Validators.required]]
  });

  set query(query: Graphql) {
    this._query = query;
    this.form.setValue({
      title: query.title,
      text: query.text
    }, {emitEvent: false});
  }

  get query() {
    return this._query;
  }

  @ViewChild('formRef')
  formRef: FormComponent;

  constructor(public manager: SpecManager,
              private fb: FormBuilder,
              private logger: NGXLogger,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.data.subscribe(({feature, query}) =>
      [this.feature, this.query] = [feature, query]);

    this.form.valueChanges.subscribe(() => this.formRef.submit());
  }

  save() {
    const {title, text} = this.form.getRawValue();
    Object.assign(this.query, {title, text});
    this.manager.put(this.query);
    this.feature.version++;
  }

}
