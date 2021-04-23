import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UI } from '@junte/ui';
import { Subscription } from 'rxjs';
import { EditMode } from 'src/enums/edit-mode';
import { SpecManager } from 'src/managers/spec.manager';
import { Enum } from '../../../../../models/spec/orm/enum';

@Component({
  selector: 'spec-enum',
  templateUrl: './enum.component.html',
  styleUrls: ['./enum.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnumComponent implements AfterViewInit, OnDestroy {

  ui = UI;
  editMode = EditMode;

  private _enum: Enum;
  private subscriptions: {
    actor?: Subscription,
    form?: Subscription
  } = {};

  nameControl = this.fb.control(null);
  autoNameControl = this.fb.control(false);

  @Input()
  mode = EditMode.view;

  form = this.fb.group({
    title: [null],
    name: this.nameControl,
    autoName: this.autoNameControl
  });

  @Input()
  set enum(enum_: Enum) {
    this._enum = enum_;
    this.updateForm();

    this.subscriptions.actor?.unsubscribe();
    this.subscriptions.actor = enum_.changes.subscribe(() => this.updateForm());

    this.form.valueChanges
      .subscribe(() => {
        this.updateName();
        Object.assign(this.enum, this.form.getRawValue());
        this.manager.put(this.enum);

        this.cd.detectChanges();
      });
  }

  get enum() {
    return this._enum;
  }

  @ViewChild('titleRef')
  titleRef: ElementRef<HTMLInputElement>;

  constructor(public manager: SpecManager,
              private cd: ChangeDetectorRef,
              private fb: FormBuilder) {
    this.autoNameControl.valueChanges.subscribe(autoName =>
      autoName ? this.nameControl.disable()
        : this.nameControl.enable());
  }

  ngAfterViewInit() {
    if (!!this.titleRef) {
      this.titleRef.nativeElement.focus();
    }
  }

  ngOnDestroy() {
    [this.subscriptions.actor, this.subscriptions.form]
      .forEach(s => s?.unsubscribe());
  }

  private updateForm() {
    this.form.patchValue({
      name: this.enum.name,
      title: this.enum.title,
      autoName: this.enum.autoName
    });
  }

  private updateName() {
    const {title, autoName} = this.form.getRawValue();
    if (autoName) {
      let name = title.toLowerCase();
      name = name.replace(/\s+/g, '_');
      this.nameControl.patchValue(name, {emitEvent: false});
    }
  }

}
