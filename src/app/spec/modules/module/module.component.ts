import { CdkDragDrop } from '@angular/cdk/drag-drop';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UI } from '@junte/ui';
import { Subscription } from 'rxjs';
import { EditMode } from 'src/enums/edit-mode';
import { SpecManager } from 'src/app/spec/managers';
import { Module } from 'src/models/spec/planning/module';
import { LocalUI } from '../../../../enums/local-ui';
import { Entity } from '../../../../models/spec/orm/entity';
import { Enum } from '../../../../models/spec/orm/enum';
import { Feature } from '../../../../models/spec/planning/feature';

@Component({
  selector: 'spec-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModuleComponent implements AfterViewInit, OnDestroy {

  ui = UI;
  localUi = LocalUI;
  editMode = EditMode;

  private _module: Module;
  private subscriptions: {
    module?: Subscription,
    form?: Subscription
  } = {};

  version = 0;

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

    this.subscriptions.module?.unsubscribe();
    this.subscriptions.module = module.changes.subscribe(() => this.updateForm());

    this.subscriptions.form?.unsubscribe();
    this.subscriptions.form = this.form.valueChanges
      .subscribe(() => {
        const {title} = this.form.getRawValue();
        this.module.title = title;
        this.manager.put(this.module);

        this.cd.detectChanges();
      });
  }

  get module() {
    return this._module;
  }

  @ViewChild('titleRef')
  titleRef: ElementRef<HTMLInputElement>;

  constructor(public manager: SpecManager,
              private fb: FormBuilder,
              private cd: ChangeDetectorRef,
              public route: ActivatedRoute,
              public router: Router) {

  }

  ngAfterViewInit() {
    if (!!this.titleRef) {
      this.titleRef.nativeElement.focus();
    }
  }

  ngOnDestroy() {
    [this.subscriptions.module, this.subscriptions.form]
      .forEach(s => s?.unsubscribe());
  }

  private updateForm() {
    this.form.patchValue({
      title: this.module.title
    });
  }

  trackElement(index: number, {id}) {
    return id || null;
  }

  onDropFromLibrary({item: {data}}: CdkDragDrop<{ id: string }[]>) {
    if (data instanceof Feature) {
      this.attachFeature(data);
    } else if (data instanceof Entity) {
      this.attachEntity(data);
    } else if (data instanceof Enum) {
      this.attachEnum(data);
    }

    this.version++;
    this.cd.detectChanges();

    this.updated.emit(this.module);
  }

  attachFeature(feature: Feature) {
    if (!!feature.module) {
      const index = feature.module.features.indexOf(feature);
      feature.module.features.splice(index, 1);
      this.manager.put(feature.module);
    }
    this.module.features.push(feature);
    feature.linking({module: this.module});
    this.manager.put(this.module);
  }

  attachEntity(entity: Entity) {
    if (!!entity.module) {
      const index = entity.module.model.entities.indexOf(entity);
      entity.module.model.entities.splice(index, 1);
      this.manager.put(entity.module.model);
    }

    this.module.model.entities.push(entity);
    entity.linking({module: this.module});
    this.manager.put(this.module.model);
  }

  attachEnum(enum_: Enum) {
    if (!!enum_.module) {
      const index = enum_.module.model.enums.indexOf(enum_);
      enum_.module.model.entities.splice(index, 1);
      this.manager.put(enum_.module.model);
    }

    this.module.model.enums.push(enum_);
    enum_.linking({module: this.module});
    this.manager.put(this.module.model);
  }

  deleteFeature(feature: Feature) {
    const index = this.module.features.indexOf(feature);
    this.module.features.splice(index, 1);
    this.manager.put(this.module);

    feature.module = null;

    this.version++;
    this.cd.detectChanges();

    this.updated.emit(this.module);
  }

  deleteEntity(entity: Entity) {
    const index = this.module.model.entities.indexOf(entity);
    this.module.model.entities.splice(index, 1);
    this.manager.put(this.module.model);

    entity.module = null;

    this.version++;
    this.cd.detectChanges();

    this.updated.emit(this.module);
  }

  deleteEnum(enum_: Enum) {
    const index = this.module.model.enums.indexOf(enum_);
    this.module.model.enums.splice(index, 1);
    this.manager.put(this.module.model);

    enum_.module = null;

    this.version++;
    this.cd.detectChanges();

    this.updated.emit(this.module);
  }

}
