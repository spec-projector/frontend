import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PopoverService, UI } from '@junte/ui';
import { Subscription } from 'rxjs';
import { Language } from 'src/enums/language';
import { CURRENT_LANGUAGE } from '../../../../../consts';
import { Feature } from '../../../../../models/spec/planning/feature/feature';
import { Resource } from '../../../../../models/spec/planning/feature/resource';
import { SpecManager } from '../../../managers/spec';

@Component({
  selector: 'spec-feature-resources',
  templateUrl: './feature-resources.component.html',
  styleUrls: ['./feature-resources.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeatureResourcesComponent implements OnInit {

  ui = UI;
  language = Language;
  consts = {language: CURRENT_LANGUAGE};

  private _feature: Feature;
  private subscriptions: { form: Subscription } = {form: null};

  resourcesArray = this.fb.array([]);
  form = this.fb.group({
    resources: this.resourcesArray
  });

  @Input()
  set feature(feature: Feature) {
    this._feature = feature;
    feature.resources.forEach(({resource, hours}) => {
      const g = this.resourcesGroup();
      g.patchValue({resource, hours});
      this.resourcesArray.push(g);
    });

    this.subscriptions.form?.unsubscribe();
    this.subscriptions.form = this.form.valueChanges
      .subscribe(({resources}) => {
        this.feature.resources = resources.map(({resource, hours}) =>
          new Resource({resource, hours: hours}));
        this.manager.put(this.feature);
      });
  }

  get feature() {
    return this._feature;
  }

  constructor(public manager: SpecManager,
              private fb: FormBuilder,
              private popover: PopoverService,
              private cd: ChangeDetectorRef,
              private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.route.data.subscribe(({feature}) => this.feature = feature);
  }

  resourcesGroup() {
    return this.fb.group({
      resource: [null],
      hours: [null]
    });
  }

  fill() {
    for (const r of this.feature.spec.resourceTypes) {
      const group = this.resourcesGroup();
      group.patchValue({resource: r.title});
      this.resourcesArray.push(group);
    }

    this.cd.detectChanges();
  }

  add() {
    this.resourcesArray.push(this.resourcesGroup());
    this.cd.detectChanges();
  }

  delete(index: number) {
    this.resourcesArray.removeAt(index);
    this.cd.detectChanges();
  }

}
