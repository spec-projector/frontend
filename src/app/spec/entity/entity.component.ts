import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UI } from '@junte/ui';
import { merge } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { EditMode } from 'src/enums/edit-mode';
import { SpecManager } from 'src/managers/spec.manager';
import { Entity } from 'src/models/spec/orm/entity';

@Component({
  selector: 'spec-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.scss']
})
export class EntityComponent {

  ui = UI;
  editMode = EditMode;

  private _entity: Entity;

  mode = EditMode.view;

  titleControl = this.fb.control(null);
  nameControl = this.fb.control(null);
  autoNameControl = this.fb.control(false);
  form = this.fb.group({
    title: this.titleControl,
    name: this.nameControl,
    autoName: this.autoNameControl
  });

  @Input()
  set entity(entity: Entity) {
    this._entity = entity;
    this.updateForm();

    entity.changes.subscribe(() => this.updateForm());
  }

  get entity() {
    return this._entity;
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
      .pipe(filter(() => !!this.entity),
        tap(() => Object.assign(this.entity, this.form.getRawValue())))
      .subscribe(() => this.manager.put(this.entity));
  }

  private updateForm() {
    this.form.patchValue({
      name: this.entity.name,
      title: this.entity.title,
      autoName: this.entity.autoName
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
