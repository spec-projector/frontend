import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UI } from '@junte/ui';
import { merge } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { EditMode } from 'src/enums/edit-mode';
import { SpecManager } from 'src/managers/spec.manager';
import { EntityField } from 'src/models/spec/orm/entity-field';
import { Enum, EnumOption } from '../../../models/spec/orm/enum';

@Component({
  selector: 'spec-enum',
  templateUrl: './enum.component.html',
  styleUrls: ['./enum.component.scss']
})
export class EnumComponent {

  ui = UI;
  editMode = EditMode;

  private _enum: Enum;

  titleControl = this.fb.control(null);
  nameControl = this.fb.control(null);
  autoNameControl = this.fb.control(false);

  mode = EditMode.view;

  form = this.fb.group({
    title: this.titleControl,
    name: this.nameControl,
    autoName: this.autoNameControl
  });

  @Input()
  set enum(_enum: Enum) {
    this._enum = _enum;
    this.updateForm();

    _enum.changes.subscribe(() => this.updateForm());
  }

  get enum() {
    return this._enum;
  }

  constructor(public manager: SpecManager,
              private fb: FormBuilder) {
    this.autoNameControl.valueChanges.subscribe(() =>
      this.autoNameControl.value
        ? this.nameControl.disable()
        : this.nameControl.enable());

    merge(this.titleControl.valueChanges, this.autoNameControl.valueChanges)
      .subscribe(() => this.updateName());

    this.form.valueChanges
      .pipe(filter(() => !!this.enum),
        tap(() => Object.assign(this.enum, this.form.getRawValue())))
      .subscribe(() => this.manager.put(this.enum));
  }

  private updateForm() {
    this.form.patchValue({
      name: this.enum.name,
      title: this.enum.title,
      autoName: this.enum.autoName
    });
  }

  private updateName() {
    if (this.autoNameControl.value) {
      let name = this.titleControl.value.toLowerCase();
      name = name.replace(/\s+/g, '_');
      this.nameControl.patchValue(name);
    }
  }

}
