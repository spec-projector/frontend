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
import { SpecManager } from 'src/app/spec/managers/spec';
import { Module } from 'src/models/spec/planning/module';
import { LocalUI } from '../../../../enums/local-ui';
import { Entity } from '../../../../models/spec/orm/entity';
import { Enum } from '../../../../models/spec/orm/enum';
import { Feature } from '../../../../models/spec/planning/feature/feature';
import { trackElement } from '../../../../utils/templates';

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
  trackElement = trackElement;

  private _mode = EditMode.view;
  private _module: Module;
  private subscriptions: {
    module?: Subscription,
    form?: Subscription
  } = {};

  version = 0;

  @Input()
  set mode(mode: EditMode) {
    this._mode = mode;
    this.cd.detectChanges();
  }

  get mode() {
    return this._mode;
  }

  @Output()
  updated = new EventEmitter<Module>();

  form = this.fb.group({
    title: [null]
  });

  @Input()
  set module(module: Module) {
    this._module = module;
    this.updateForm();

    this.subscriptions.module?.unsubscribe();
    this.subscriptions.module = module.replicated$.subscribe(() => this.updateForm());

    this.subscriptions.form?.unsubscribe();
    this.subscriptions.form = this.form.valueChanges
      .subscribe(() => {
        const {title} = this.form.getRawValue();
        Object.assign(this.module, {title});
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
    this.cd.detach();
  }

  ngAfterViewInit() {
    this.titleRef?.nativeElement.focus();
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
      feature.module.removeFeature(feature);
      this.manager.put(feature.module);
    }
    feature.linking({module: this.module});
    this.module.addFeature(feature);
    this.manager.put(this.module);
  }

  attachEntity(entity: Entity) {
    if (!!entity.module) {
      const {model} = entity.module;
      model.removeEntity(entity);
      this.manager.put(model);
    }
    entity.linking({module: this.module});
    this.module.model.addEntity(entity);
    this.manager.put(this.module.model);
  }

  attachEnum(enum_: Enum) {
    if (!!enum_.module) {
      const {model} = enum_.module;
      model.removeEnum(enum_);
      this.manager.put(model);
    }

    enum_.linking({module: this.module});
    this.module.model.addEnum(enum_);
    this.manager.put(this.module.model);
  }

  deleteFeature(feature: Feature) {
    feature.module = null;
    this.module.removeFeature(feature);
    this.manager.put(this.module);

    this.version++;
    this.cd.detectChanges();

    this.updated.emit(this.module);
  }

  deleteEntity(entity: Entity) {
    entity.module = null;
    this.module.model.removeEntity(entity);
    this.manager.put(this.module.model);

    this.version++;
    this.cd.detectChanges();

    this.updated.emit(this.module);
  }

  deleteEnum(enum_: Enum) {
    enum_.module = null;
    this.module.model.removeEnum(enum_);
    this.manager.put(this.module.model);

    this.version++;
    this.cd.detectChanges();

    this.updated.emit(this.module);
  }

}
