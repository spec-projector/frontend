import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { SpecManager } from 'src/managers/spec.manager';
import { EditMode } from 'src/enums/edit-mode';
import { PopoverInstance, UI } from '@junte/ui';
import { Entity } from 'src/models/spec/orm/entity';
import { EntityField, FieldType } from 'src/models/spec/orm/entity-field';
import { merge } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { Enum } from '../../../../../../../models/spec/orm/enum';

@Component({
  selector: 'spec-entity-field',
  templateUrl: './entity-field.component.html',
  styleUrls: ['./entity-field.component.scss']
})
export class EntityFieldComponent {

  ui = UI;
  fieldType = FieldType;
  editMode = EditMode;

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
    });
  }

  get field() {
    return this._field;
  }

  @Output()
  changed = new EventEmitter<EntityField>();

  constructor(public manager: SpecManager,
              private fb: FormBuilder) {
    this.autoNameControl.valueChanges.subscribe(() =>
      this.autoNameControl.value ? this.nameControl.disable() : this.nameControl.enable());

    merge(this.titleControl.valueChanges, this.autoNameControl.valueChanges)
      .subscribe(() => this.updateName());

    this.form.valueChanges
      .pipe(filter(() => !!this.field),
        tap(() => Object.assign(this.field, this.form.getRawValue())))
      .subscribe(() => {
        this.field.linking();
        this.changed.emit(this.field);
      });
  }

  private updateName() {
    if (this.autoNameControl.value) {
      let title = this.titleControl.value.toLowerCase();
      title = title.replace(/\s+/g, '_');
      this.nameControl.patchValue(title);
    }
  }

  trackEntity(index: number, entity: Entity) {
    return !!entity ? entity.id : null;
  }

  trackEnum(index: number, _enum: Enum) {
    return !!_enum ? _enum.id : null;
  }

}
