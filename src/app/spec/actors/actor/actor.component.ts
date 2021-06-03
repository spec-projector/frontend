import { CdkDragDrop } from '@angular/cdk/drag-drop';
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
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService, UI } from '@junte/ui';
import { Subscription } from 'rxjs';
import { SpecManager } from 'src/app/spec/managers';
import { EditMode } from 'src/enums/edit-mode';
import { Actor } from 'src/models/spec/planning/actor';
import { Feature } from 'src/models/spec/planning/feature/feature';
import { TextToken } from 'src/models/spec/planning/token';
import { trackElement } from 'src/utils/templates';
import { CURRENT_LANGUAGE } from '../../../../consts';
import { Language } from '../../../../enums/language';
import { LocalUI } from '../../../../enums/local-ui';

@Component({
  selector: 'spec-actor',
  templateUrl: './actor.component.html',
  styleUrls: ['./actor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActorComponent implements AfterViewInit, OnDestroy {

  ui = UI;
  localUi = LocalUI;
  editMode = EditMode;
  language = Language;
  trackElement = trackElement;
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
    this.subscriptions.actor = actor.replicated$.subscribe(() => this.updateForm());

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
    }, {emitEvent: false});
    this.cd.detectChanges();
  }

  addFeature() {
    const feature = new Feature({
      title: [new TextToken($localize`:@@label.new_feature_example:Buy a cookies`)]
    });
    feature.linking({spec: this.actor.spec, actor: this.actor});
    feature.new().forEach(o => this.manager.put(o));
    this.manager.put(feature);

    this.actor.addFeature(feature);
    this.manager.put(this.actor);

    this.added = feature.id;
    this.version++;
    this.cd.detectChanges();
  }

  moveFeature(event: CdkDragDrop<Feature[]>) {
    const features = event.container.data;
    const prev = features[event.previousIndex];
    const next = features[event.currentIndex];
    const sort = next.sort;
    next.sort = prev.sort;
    prev.sort = sort;

    this.manager.put(prev);
    this.manager.put(next);

    this.version++;
    this.cd.detectChanges();
  }

  deleteFeature(feature: Feature) {
    const links = feature.delete();
    links.deleted.forEach(o => this.manager.remove(o));
    links.changed.forEach(o => this.manager.put(o));

    this.version++;
    this.cd.detectChanges();
    this.modal.close();
  }

}
