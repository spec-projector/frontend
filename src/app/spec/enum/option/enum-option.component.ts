import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UI } from '@junte/ui';
import { merge } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { EditMode } from 'src/enums/edit-mode';
import { SpecManager } from 'src/managers/spec.manager';
import { FieldType } from 'src/models/spec/orm/entity-field';
import { EnumOption } from '../../../../models/spec/orm/enum';

@Component({
  selector: 'spec-enum-option',
  templateUrl: './enum-option.component.html',
  styleUrls: ['./enum-option.component.scss']
})
export class EnumOptionComponent {

  ui = UI;
  fieldType = FieldType;
  editMode = EditMode;

  private _option: EnumOption;

  titleControl = this.fb.control(null);
  nameControl = this.fb.control(null);
  autoNameControl = this.fb.control(false);
  form = this.fb.group({
    name: this.nameControl,
    title: this.titleControl,
    autoName: this.autoNameControl
  });

  mode = EditMode.view;

  @Input()
  set option(option: EnumOption) {
    this._option = option;
    this.form.patchValue({
      name: option.name,
      title: option.title,
      autoName: option.autoName
    });
  }

  get option() {
    return this._option;
  }

  @Output()
  changed = new EventEmitter<EnumOption>();

  constructor(public manager: SpecManager,
              private fb: FormBuilder) {
    this.autoNameControl.valueChanges.subscribe(() =>
      this.autoNameControl.value ? this.nameControl.disable() : this.nameControl.enable());

    merge(this.titleControl.valueChanges, this.autoNameControl.valueChanges)
      .subscribe(() => this.updateName());

    this.form.valueChanges
      .pipe(filter(() => !!this.option),
        tap(() => Object.assign(this.option, this.form.getRawValue())))
      .subscribe(() => this.changed.emit(this.option));
  }

  private updateName() {
    if (this.autoNameControl.value) {
      let title = this.titleControl.value.toLowerCase();
      title = title.replace(/\s+/g, '_');
      this.nameControl.patchValue(title);
    }
  }

}
