import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PopoverInstance, UI } from '@junte/ui';
import { merge } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { SpecManager } from 'src/managers/spec.manager';
import { EditMode } from 'src/enums/edit-mode';
import { Entity } from 'src/models/spec/orm/entity';
import { Package } from 'src/models/spec/orm/package';
import { isUndefined } from 'util';
import * as uuid from 'uuid/v1';
import { Enum } from '../../../../models/spec/orm/enum';

@Component({
  selector: 'spec-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.scss']
})
export class PackageComponent {

  ui = UI;
  editMode = EditMode;

  private _package: Package;

  mode = EditMode.view;
  instance: { popover: PopoverInstance } = {popover: null};

  titleControl = this.fb.control(null);
  nameControl = this.fb.control(null);
  autoNameControl = this.fb.control(false);
  form = this.fb.group({
    title: this.titleControl,
    name: this.nameControl,
    autoName: this.autoNameControl
  });

  @Input()
  set package(pack: Package) {
    this._package = pack;
    this.updateForm();

    pack.changes.subscribe(() => this.updateForm());
  }

  get package() {
    return this._package;
  }

  constructor(public manager: SpecManager,
              private fb: FormBuilder,
              public route: ActivatedRoute,
              public router: Router) {
    this.autoNameControl.valueChanges.subscribe(() =>
      this.autoNameControl.value ? this.nameControl.disable() : this.nameControl.enable());

    merge(this.titleControl.valueChanges, this.autoNameControl.valueChanges)
      .subscribe(() => this.updateName());

    this.form.valueChanges
      .pipe(filter(() => !!this.package),
        tap(() => Object.assign(this.package, this.form.getRawValue())))
      .subscribe(() => this.manager.put(this.package));
  }

  private updateForm() {
    this.form.patchValue({
      name: this.package.name,
      title: this.package.title,
      autoName: this.package.autoName
    });
  }

  private updateName() {
    if (this.autoNameControl.value) {
      let name = this.titleControl.value.toLowerCase();
      name = name.replace(/\s+/g, '_');
      this.nameControl.patchValue(name);
    }
  }

  addEntity() {
    this.instance.popover?.hide();

    const entity = new Entity({
      id: uuid(),
      name: 'entity',
      title: 'Entity'
    });
    entity.linking(this.package);
    this.package.entities.push(entity);

    this.manager.put(entity);
    this.manager.put(this.package);
  }

  addEnum() {
    this.instance.popover?.hide();

    const _enum = new Enum({
      id: uuid(),
      name: 'enum',
      title: 'Enum'
    });
    _enum.linking(this.package);
    this.package.enums.push(_enum);

    this.manager.put(_enum);
    this.manager.put(this.package);
  }

  deleteEntity(index: number) {
    const entity = this.package.entities[index];
    this.package.entities.splice(index, 1);
    this.manager.remove(entity);
    this.manager.put(this.package);
  }

  deleteEnum(index: number) {
    const _enum = this.package.enums[index];
    this.package.enums.splice(index, 1);
    this.manager.remove(_enum);
    this.manager.put(this.package);
  }

  moveEntity(event: any) {
    const index1 = isUndefined(event.index) ? this.package.entities.length - 1 : event.index;
    const index2 = event.data;
    const e1 = this.package.entities[index1];
    const e2 = this.package.entities[index2];
    this.package.entities.splice(index1, 1, e2);
    this.package.entities.splice(index2, 1, e1);
    this.manager.put(this.package);
  }

}
