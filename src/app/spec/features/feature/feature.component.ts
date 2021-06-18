import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UI } from '@junte/ui';
import { Subscription } from 'rxjs';
import { SpecManager } from 'src/app/spec/managers/spec';
import { EditMode } from 'src/enums/edit-mode';
import { LocalUI } from 'src/enums/local-ui';
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

  form = this.fb.group({
    title: [null]
  });

  @Input()
  set feature(feature: Feature) {
    this._feature = feature;
    this.updateForm();

    this.subscriptions.feature?.unsubscribe();
    this.subscriptions.feature = feature.replicated$.subscribe(() => this.updateForm());

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
              private cd: ChangeDetectorRef,
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
    }, {emitEvent: false});
    this.cd.detectChanges();
  }

}
