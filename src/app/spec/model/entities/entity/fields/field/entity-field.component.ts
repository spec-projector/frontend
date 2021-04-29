import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UI } from '@junte/ui';
import { merge } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { SpecManager } from 'src/app/spec/managers';
import { EditMode } from 'src/enums/edit-mode';
import { EntityField, FieldType } from 'src/models/spec/orm/entity-field';
import { LocalUI } from '../../../../../../../enums/local-ui';
import { trackElement } from '../../../../../../../utils/templates';

@Component({
  selector: 'spec-entity-field',
  templateUrl: './entity-field.component.html',
  styleUrls: ['./entity-field.component.scss']
})
export class EntityFieldComponent {

  ui = UI;
  localUi = LocalUI;
  fieldType = FieldType;
  editMode = EditMode;
  trackElement = trackElement;

  private _field: EntityField;

  mode = EditMode.view;

  titleControl = this.fb.control(null);
  nameControl = this.fb.control(null);
  autoNameControl = this.fb.control(false);
  typeControlControl = this.fb.control(null);
  form = this.fb.group({
    name: this.nameControl,
    title: this.titleControl,
    autoName: this.autoNameControl,
    type: this.typeControlControl,
    required: [false],
    isArray: [false],
    reference: [null],
    enum: [null]
  });

  @Input()
  set field(field: EntityField) {
    this._field = field;
    this.form.patchValue({
      name: field.name,
      title: field.title,
      autoName: field.autoName,
      type: field.type,
      required: field.required,
      isArray: field.isArray,
      reference: field.reference,
      enum: field.enum
    }, {emitEvent: false});
  }

  get field() {
    return this._field;
  }

  constructor(public manager: SpecManager,
              private cd: ChangeDetectorRef,
              private fb: FormBuilder) {
    this.autoNameControl.valueChanges.subscribe(() =>
      this.autoNameControl.value ? this.nameControl.disable() : this.nameControl.enable());

    merge(this.titleControl.valueChanges, this.autoNameControl.valueChanges)
      .subscribe(() => this.updateName());

    this.form.valueChanges.subscribe(() => {
      Object.assign(this.field, this.form.getRawValue());
      this.manager.put(this.field);
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
