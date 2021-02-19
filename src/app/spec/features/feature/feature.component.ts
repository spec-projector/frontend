import { Component, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { UI } from '@junte/ui';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LocalUI } from 'src/enums/local-ui';
import { SpecManager } from 'src/managers/spec.manager';
import { EditMode } from 'src/enums/edit-mode';
import { Feature } from 'src/model/spec/planning/feature';
import { Token } from 'src/model/spec/planning/token';

@Component({
  selector: 'spec-feature',
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.scss']
})
export class FeatureComponent implements OnDestroy {

  ui = UI;
  localUi = LocalUI;
  editMode = EditMode;

  private destroyed = new Subject();
  private _feature: Feature;
  private subscriptions: Partial<{
    feature: Subscription,
    form: Subscription
  }> = {};

  mode = EditMode.view;

  title = new FormControl();
  form = this.fb.group({
    title: this.title
  });

  @Input()
  set feature(feature: Feature) {
    this._feature = feature;
    this.updateForm();

    this.subscriptions.feature?.unsubscribe();
    this.subscriptions.feature = feature.changes.subscribe(() => this.updateForm());

    this.subscriptions.form?.unsubscribe();
    this.subscriptions.form = this.form.valueChanges
      .subscribe(() => {
        const {title} = this.form.getRawValue();
        this.feature.title = Token.parse(title);
        this.manager.put(this.feature);
      });
  }

  get feature() {
    return this._feature;
  }

  constructor(public manager: SpecManager,
              private fb: FormBuilder) {
  }

  ngOnDestroy() {
    this.subscriptions.feature?.unsubscribe();
    this.subscriptions.form?.unsubscribe();
  }

  private updateForm() {
    this.form.patchValue({
      title: this.feature.title.map(t => t.toString()).join(' ')
    });
  }

}
