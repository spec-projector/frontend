import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {Component, Input} from '@angular/core';
import {FormBuilder, FormControl} from '@angular/forms';
import {SpecManager} from 'src/managers/spec.manager';
import {EditMode} from 'src/enums/edit-mode';
import {UI} from '@junte/ui';
import {Entity} from 'src/model/spec/orm/entity';
import {EntityField} from 'src/model/spec/orm/entity-field';
import {merge} from 'rxjs';
import {filter, tap} from 'rxjs/operators';

@Component({
  selector: 'spec-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.scss']
})
export class EntityComponent {

  ui = UI;
  editMode = EditMode;

  private _entity: Entity;

  titleControl = this.fb.control(null);
  nameControl = this.fb.control(null);
  autoNameControl = this.fb.control(false);

  mode = EditMode.view;

  form = this.fb.group({
    title: this.titleControl,
    name: this.nameControl,
    autoName: this.autoNameControl
  });

  @Input() set entity(entity: Entity) {
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

  addField() {
    const field = new EntityField({
      title: 'Field',
      name: 'field'
    });
    field.linking(this.entity);
    this.entity.fields.push(field);
    this.manager.put(this.entity);
  }

  deleteField(index: number) {
    this.entity.fields.splice(index, 1);
    this.manager.put(this.entity);
  }

  moveField(event: CdkDragDrop<EntityField[]>) {
    moveItemInArray(this.entity.fields, event.previousIndex, event.currentIndex);
    this.manager.put(this.entity);
  }

  trackField(index: number) {
    return index;
  }

}
