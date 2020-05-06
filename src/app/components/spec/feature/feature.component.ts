import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { UI } from 'junte-ui';
import { Subscription } from 'rxjs';
import { LocalUI } from 'src/app/enums/local-ui';
import { SpecManager } from 'src/app/managers/spec.manager';
import { EditMode } from 'src/app/model/enums/edit-mode';
import { Feature } from 'src/app/model/spec/planning/feature';
import { Token } from 'src/app/model/spec/planning/token';

@Component({
  selector: 'spec-feature',
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.scss']
})
export class FeatureComponent {

  ui = UI;
  localUi = LocalUI;
  editMode = EditMode;

  private _feature: Feature;
  private subscriptions: { form: Subscription } = {form: null};

  mode = EditMode.view;

  title = new FormControl();
  form = this.fb.group({
    title: this.title
  });

  @Input()
  set feature(feature: Feature) {
    if (!!this.subscriptions.form) {
      this.subscriptions.form.unsubscribe();
    }
    this._feature = feature;
    this.updateForm();

    feature.changes.subscribe(() => this.updateForm());

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

  private updateForm() {
    this.form.patchValue({
      title: this.feature.title.map(t => t.toString()).join(' ')
    });
  }

}
