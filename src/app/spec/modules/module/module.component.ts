import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PopoverInstance, UI } from '@junte/ui';
import { filter, tap } from 'rxjs/operators';
import { SpecManager } from 'src/managers/spec.manager';
import { EditMode } from 'src/enums/edit-mode';
import { Module } from 'src/models/spec/planning/module';
import { Entity } from '../../../../models/spec/orm/entity';
import { Feature } from '../../../../models/spec/planning/feature';

@Component({
  selector: 'spec-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModuleComponent {

  ui = UI;
  editMode = EditMode;

  private _module: Module;

  instance: { popover: PopoverInstance } = {popover: null};
  version = 0;
  added: string;

  @Input()
  mode = EditMode.view;

  @Output()
  updated = new EventEmitter<Module>();

  title = new FormControl();
  form = this.fb.group({
    title: this.title
  });

  @Input()
  set module(module: Module) {
    this._module = module;
    this.updateForm();

    module.changes.subscribe(() => this.updateForm());
  }

  get module() {
    return this._module;
  }

  constructor(public manager: SpecManager,
              private fb: FormBuilder,
              private cd: ChangeDetectorRef,
              public route: ActivatedRoute,
              public router: Router) {
    this.form.valueChanges
      .pipe(filter(() => !!this.module),
        tap(() => Object.assign(this.module, this.form.getRawValue())))
      .subscribe(() => this.manager.put(this.module));
  }

  private updateForm() {
    this.form.patchValue({
      title: this.module.title
    });
  }

  trackFeature(index: number, feature: Feature) {
    return !!feature ? feature.id : null;
  }

  trackEntity(index: number, entity: Entity) {
    return !!entity ? entity.id : null;
  }

  onDropFromLibrary({item: {data}}: CdkDragDrop<{ id: string }[]>) {
    if (data instanceof Feature) {
      const features = this.module.spec.actors.reduce((res, actor) => res.concat(actor.features), []);
      const feature: Feature = features.find(e => e.id === data.id);
      if (!!feature.module) {
        const index = feature.module.features.indexOf(feature);
        feature.module.features.splice(index, 1);
        this.manager.put(feature.module);
      }
      this.module.features.push(data);
      data.linking({module: this.module});
      this.manager.put(this.module);

    } else if (data instanceof Entity) {
      const entity: Entity = this.module.spec.model.entities.find(e => e.id === data.id);
      if (!!entity.module) {
        const index = entity.module.model.entities.indexOf(entity);
        entity.module.model.entities.splice(index, 1);
        this.manager.put(entity.module.model);
      }

      this.module.model.entities.push(entity);
      entity.linking({module: this.module});
      this.manager.put(this.module.model);
    }

    this.version++;
    this.cd.detectChanges();

    this.updated.emit(this.module);
  }

  deleteFeature(feature: Feature) {
    const index = this.module.features.indexOf(feature);
    this.module.features.splice(index, 1);
    this.manager.put(this.module);

    feature.module = null;

    this.version++;
    this.cd.detectChanges();
  }

  deleteEntity(entity: Entity) {
    const index = this.module.model.entities.indexOf(entity);
    this.module.model.entities.splice(index, 1);
    this.manager.put(this.module.model);

    entity.module = null;

    this.version++;
    this.cd.detectChanges();
  }

}
