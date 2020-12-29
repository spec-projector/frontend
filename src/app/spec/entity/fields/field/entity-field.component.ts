import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { SpecManager } from 'src/managers/spec.manager';
import { EditMode } from 'src/enums/edit-mode';
import { UI } from '@junte/ui';
import { Entity } from 'src/model/spec/orm/entity';
import { EntityField, FieldType } from 'src/model/spec/orm/entity-field';
import { merge } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

@Component({
  selector: 'spec-entity-field',
  templateUrl: './entity-field.component.html',
  styleUrls: ['./entity-field.component.scss']
})
export class EntityFieldComponent {

  private _field: EntityField;

  ui = UI;
  fieldType = FieldType;
  editMode = EditMode;

  title = new FormControl();
  name = new FormControl();
  autoName = new FormControl();
  typeControl = new FormControl();
  requiredControl = new FormControl();

  form = this.formBuilder.group({
    name: this.name,
    title: this.title,
    autoName: this.autoName,
    type: this.typeControl,
    required: this.requiredControl,
    reference: null
  });

  mode = EditMode.view;

  @Input() set field(field: EntityField) {
    this._field = field;
    this.form.patchValue({
      name: field.name,
      title: field.title,
      autoName: field.autoName,
      type: field.type,
      required: field.required,
      reference: field.reference
    });
  }

  get field() {
    return this._field;
  }

  @Output() changed = new EventEmitter<EntityField>();

  constructor(public manager: SpecManager,
              private formBuilder: FormBuilder) {
    this.autoName.valueChanges.subscribe(() =>
      this.autoName.value ? this.name.disable() : this.name.enable());

    merge(this.title.valueChanges, this.autoName.valueChanges)
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
    if (this.autoName.value) {
      let title = this.title.value.toLowerCase();
      title = title.replace(/\s+/g, '_');
      this.name.patchValue(title);
    }
  }

  trackEntity(index: number, entity: Entity) {
    return !!entity ? entity.id : null;
  }

}
