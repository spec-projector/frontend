import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PopoverService, UI } from '@junte/ui';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { config } from '../../../../../environments/environment';
import { SpecManager } from '../../../../../managers/spec.manager';
import { Feature } from '../../../../../model/spec/planning/feature';
import { ResourceType } from '../../../../../model/spec/spec';

@Component({
  selector: 'spec-feature-resources',
  templateUrl: './feature-resources.component.html',
  styleUrls: ['./feature-resources.component.scss']
})
export class FeatureResourcesComponent implements OnInit {

  ui = UI;

  private _feature: Feature;
  private subscriptions: { form: Subscription } = {form: null};

  resources = this.fb.array([]);
  form = this.fb.group({
    resources: this.resources
  });

  @Input()
  set feature(feature: Feature) {
    if (!!this.subscriptions.form) {
      this.subscriptions.form.unsubscribe();
    }

    this._feature = feature;
    feature.resources.forEach(({resource, hours}) => {
      const g = this.resourcesGroup();
      g.patchValue({resource, hours});
      this.resources.push(g);
    });

    this.subscriptions.form = this.form.valueChanges
      .pipe(debounceTime(config.uiDebounceTime))
      .subscribe(({resources}) => {
        this.feature.resources = resources.map(({resource, hours}) =>
          new ResourceType({resource, hours: +hours}));
        this.save();
      });
  }

  get feature() {
    return this._feature;
  }

  constructor(public manager: SpecManager,
              private fb: FormBuilder,
              private popover: PopoverService,
              private route: ActivatedRoute,
              private logger: NGXLogger) {

  }

  ngOnInit() {
    this.route.data.subscribe(({feature}) => this.feature = feature);
  }

  resourcesGroup() {
    return this.fb.group({
      resource: [null, [Validators.required]],
      hours: [null, [Validators.required]]
    });
  }

  fill() {
    for (const r of this.feature.spec.resourceTypes) {
      const group = this.resourcesGroup();
      group.patchValue({resource: r.title});
      this.resources.push(group);
    }
  }

  add() {
    this.resources.push(this.resourcesGroup());
  }

  delete(index: number) {
    this.resources.removeAt(index);
  }

  save() {
    this.logger.log('save resources for feature [', this.feature.title.toString(), ']');
    this.manager.put(this.feature);

    this.feature.version++;
  }

}