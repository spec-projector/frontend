import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { UI } from '@junte/ui';
import { Subject, Subscription } from 'rxjs';
import { EditMode } from 'src/enums/edit-mode';
import { LocalUI } from 'src/enums/local-ui';
import { SpecManager } from 'src/app/spec/managers';
import { Feature } from 'src/models/spec/planning/feature/feature';
import { Token } from 'src/models/spec/planning/token';

@Component({
  selector: 'spec-feature',
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.scss']
})
export class FeatureComponent implements AfterViewInit, OnDestroy {

  ui = UI;
  localUi = LocalUI;
  editMode = EditMode;

  private _feature: Feature;
  private subscriptions: {
    feature?: Subscription,
    form?: Subscription
  } = {};

  @Input()
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

  @ViewChild('nameRef')
  nameRef: ElementRef<HTMLInputElement>;

  constructor(public manager: SpecManager,
              private fb: FormBuilder) {
  }

  ngAfterViewInit() {
    if (!!this.nameRef) {
      this.nameRef.nativeElement.focus();
    }
  }

  ngOnDestroy() {
    [this.subscriptions.feature, this.subscriptions.form]
      .forEach(s => s?.unsubscribe());
  }

  private updateForm() {
    this.form.patchValue({
      title: this.feature.title.map(t => t.toString()).join(' ')
    });
  }

}
