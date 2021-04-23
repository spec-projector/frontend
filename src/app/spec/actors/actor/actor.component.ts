import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Input,
  LOCALE_ID,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService, PopoverInstance, PopoverService, UI } from '@junte/ui';
import { Subscription } from 'rxjs';
import { generate as shortid } from 'shortid';
import { EditMode } from 'src/enums/edit-mode';
import { SpecManager } from 'src/managers/spec.manager';
import { Actor } from 'src/models/spec/planning/actor';
import { Feature } from 'src/models/spec/planning/feature';
import { TextToken } from 'src/models/spec/planning/token';
import { CURRENT_LANGUAGE } from '../../../../consts';
import { Language } from '../../../../enums/language';

@Component({
  selector: 'spec-actor',
  templateUrl: './actor.component.html',
  styleUrls: ['./actor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActorComponent implements AfterViewInit, OnDestroy {

  ui = UI;
  editMode = EditMode;
  language = Language;
  consts = {language: CURRENT_LANGUAGE};

  private _actor: Actor;
  private subscriptions: {
    actor?: Subscription,
    form?: Subscription
  } = {};

  version = 0;
  added: string;

  @Input()
  mode = EditMode.view;

  nameControl = this.fb.control(null);
  form = this.fb.group({
    name: this.nameControl
  });

  @Input()
  set actor(actor: Actor) {
    this._actor = actor;
    this.updateForm();

    this.subscriptions.actor?.unsubscribe();
    this.subscriptions.actor = actor.changes.subscribe(() => this.updateForm());

    this.subscriptions.form?.unsubscribe();
    this.subscriptions.form = this.form.valueChanges
      .subscribe(() => {
        const {name} = this.form.getRawValue();
        this.actor.name = name;
        this.manager.put(this.actor);

        this.cd.detectChanges();
      });
  }

  get actor() {
    return this._actor;
  }

  @ViewChild('nameRef')
  nameRef: ElementRef<HTMLInputElement>;

  constructor(public manager: SpecManager,
              public modal: ModalService,
              private fb: FormBuilder,
              private cd: ChangeDetectorRef,
              public route: ActivatedRoute,
              public router: Router) {

  }

  ngAfterViewInit() {
    if (!!this.nameRef) {
      this.nameRef.nativeElement.focus();
    }
  }

  ngOnDestroy() {
    [this.subscriptions.actor, this.subscriptions.form]
      .forEach(s => s?.unsubscribe());
  }

  private updateForm() {
    this.form.patchValue({
      name: this.actor.name
    });
    this.cd.detectChanges();
  }

  trackFeature(index: number, feature: Feature) {
    return !!feature ? feature.id : null;
  }

  addFeature() {
    const feature = new Feature({
      id: shortid(),
      title: [new TextToken($localize`:@@label.new_feature_example:Buy a cookies`)]
    });
    this.actor.features.push(feature);
    feature.linking({spec: this.actor.spec, actor: this.actor});

    this.manager.put(feature);
    this.manager.put(this.actor);

    this.added = feature.id;
    this.version++;
    this.cd.detectChanges();
  }

  deleteFeature(feature: Feature) {
    const links = feature.delete();
    links.deleted.forEach(o => this.manager.remove(o));
    links.changed.forEach(o => this.manager.put(o));

    this.manager.remove(feature);

    this.version++;
    this.cd.detectChanges();
    this.modal.close();
  }

}
