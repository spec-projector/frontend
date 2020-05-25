import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UI } from 'junte-ui';
import { merge } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { SpecManager } from 'src/app/managers/spec.manager';
import { EditMode } from 'src/app/model/enums/edit-mode';
import { Entity } from 'src/app/model/spec/orm/entity';
import { Package } from 'src/app/model/spec/orm/package';
import { isUndefined } from 'util';
import * as uuid from 'uuid/v1';

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

  title = new FormControl();
  name = new FormControl();
  autoName = new FormControl();

  form = this.formBuilder.group({
    title: this.title,
    name: this.name,
    autoName: this.autoName
  });

  @Input() set package(pack: Package) {
    this._package = pack;
    this.updateForm();

    pack.changes.subscribe(() => this.updateForm());
  }

  get package() {
    return this._package;
  }

  constructor(public manager: SpecManager,
              private formBuilder: FormBuilder,
              public route: ActivatedRoute,
              public router: Router) {
    this.autoName.valueChanges.subscribe(() =>
      this.autoName.value ? this.name.disable() : this.name.enable());

    merge(this.title.valueChanges, this.autoName.valueChanges)
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
    if (this.autoName.value) {
      let name = this.title.value.toLowerCase();
      name = name.replace(/\s+/g, '_');
      this.name.patchValue(name);
    }
  }

  addEntity() {
    const entity = new Entity({
      id: uuid(),
      name: 'entity',
      title: 'Entity'
    });
    this.package.entities.push(entity);

    this.manager.put(entity);
    this.manager.put(this.package);
  }

  deleteEntity(index: number) {
    const entity = this.package.entities[index];
    this.package.entities.splice(index, 1);
    this.manager.remove(entity);
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
