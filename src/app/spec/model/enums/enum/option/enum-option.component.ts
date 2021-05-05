import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UI } from '@junte/ui';
import { merge } from 'rxjs';
import { SpecManager } from 'src/app/spec/managers';
import { EditMode } from 'src/enums/edit-mode';
import { FieldType } from 'src/models/spec/orm/entity-field';
import { EnumOption } from '../../../../../../models/spec/orm/enum-option';

@Component({
  selector: 'spec-enum-option',
  templateUrl: './enum-option.component.html',
  styleUrls: ['./enum-option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnumOptionComponent {

  ui = UI;
  fieldType = FieldType;
  editMode = EditMode;

  private _option: EnumOption;

  titleControl = this.fb.control(null);
  nameControl = this.fb.control({value: null, disabled: true});
  autoNameControl = this.fb.control(false);
  form = this.fb.group({
    title: this.titleControl,
    name: this.nameControl,
    autoName: this.autoNameControl
  });

  @Input()
  mode = EditMode.view;

  @Input()
  set option(option: EnumOption) {
    this._option = option;
    this.form.patchValue({
      name: option.name,
      title: option.title,
      autoName: option.autoName
    }, {emitEvent: false});
  }

  get option() {
    return this._option;
  }

  constructor(public manager: SpecManager,
              private cd: ChangeDetectorRef,
              private fb: FormBuilder) {
    this.autoNameControl.valueChanges.subscribe(() =>
      this.autoNameControl.value ? this.nameControl.disable() : this.nameControl.enable());

    merge(this.titleControl.valueChanges, this.autoNameControl.valueChanges)
      .subscribe(() => this.updateName());

    this.form.valueChanges.subscribe(() => {
      Object.assign(this.option, this.form.getRawValue());
      this.manager.put(this.option);
    });
  }

  private updateName() {
    if (this.autoNameControl.value) {
      let title = this.titleControl.value.toLowerCase();
      title = title.replace(/\s+/g, '_');
      this.nameControl.patchValue(title);
    }
  }

}
