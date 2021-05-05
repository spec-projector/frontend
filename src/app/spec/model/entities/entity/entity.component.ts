import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UI } from '@junte/ui';
import { Subscription } from 'rxjs';
import { EditMode } from 'src/enums/edit-mode';
import { SpecManager } from 'src/app/spec/managers';
import { Entity } from 'src/models/spec/orm/entity';

@Component({
  selector: 'spec-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntityComponent implements AfterViewInit, OnDestroy {

  ui = UI;
  editMode = EditMode;

  private _entity: Entity;
  private subscriptions: {
    actor?: Subscription,
    form?: Subscription
  } = {};

  @Input()
  mode = EditMode.view;

  nameControl = this.fb.control({value: null, disabled: true});
  autoNameControl = this.fb.control(false);
  form = this.fb.group({
    title: [null],
    name: this.nameControl,
    autoName: this.autoNameControl
  });

  @Input()
  set entity(entity: Entity) {
    this._entity = entity;
    this.updateForm();

    this.subscriptions.actor?.unsubscribe();
    this.subscriptions.actor = entity.changes.subscribe(() => this.updateForm());

    this.form.valueChanges
      .subscribe(() => {
        this.updateName();
        Object.assign(this.entity, this.form.getRawValue());
        this.manager.put(this.entity);

        this.cd.detectChanges();
      });
  }

  get entity() {
    return this._entity;
  }

  @ViewChild('titleRef')
  titleRef: ElementRef<HTMLInputElement>;

  constructor(public manager: SpecManager,
              private cd: ChangeDetectorRef,
              private fb: FormBuilder) {
    this.autoNameControl.valueChanges.subscribe(autoName =>
      autoName ? this.nameControl.disable()
        : this.nameControl.enable());
  }

  ngAfterViewInit() {
    if (!!this.titleRef) {
      this.titleRef.nativeElement.focus();
    }
  }

  ngOnDestroy() {
    [this.subscriptions.actor, this.subscriptions.form]
      .forEach(s => s?.unsubscribe());
  }

  private updateForm() {
    this.form.patchValue({
      name: this.entity.name,
      title: this.entity.title,
      autoName: this.entity.autoName
    }, {emitEvent: false});
    this.autoNameControl.updateValueAndValidity();
  }

  private updateName() {
    const {title, autoName} = this.form.getRawValue();
    if (autoName) {
      let name = title.toLowerCase();
      name = name.replace(/\s+/g, '_');
      this.nameControl.patchValue(name, {emitEvent: false});
    }
  }

}
