import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, Inject, Input, LOCALE_ID, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PopoverInstance, PopoverService, UI } from '@junte/ui';
import { Subscription } from 'rxjs';
import { generate as shortid } from 'shortid';
import { EditMode } from 'src/enums/edit-mode';
import { SpecManager } from 'src/managers/spec.manager';
import { Actor } from 'src/model/spec/planning/actor';
import { Feature } from 'src/model/spec/planning/feature';
import { TextToken } from 'src/model/spec/planning/token';
import { Language } from '../../../../enums/language';

@Component({
  selector: 'spec-actor',
  templateUrl: './actor.component.html',
  styleUrls: ['./actor.component.scss']
})
export class ActorComponent implements OnDestroy {

  ui = UI;
  editMode = EditMode;
  language = Language;

  private _actor: Actor;
  private subscriptions: Partial<{
    actor: Subscription,
    form: Subscription
  }> = {};

  instance: { popover: PopoverInstance } = {popover: null};

  @Input()
  selected: string;

  version = 0;
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
      });
  }

  get actor() {
    return this._actor;
  }

  constructor(@Inject(LOCALE_ID) public locale: string,
              public manager: SpecManager,
              public popover: PopoverService,
              private fb: FormBuilder,
              public route: ActivatedRoute,
              public router: Router) {

  }

  ngOnDestroy() {
    this.subscriptions.actor?.unsubscribe();
    this.subscriptions.form?.unsubscribe();
  }

  private updateForm() {
    this.form.patchValue({
      name: this.actor.name
    });
  }

  onDropEpic(feature: Feature, {item: {data: {id}}}: CdkDragDrop<{ id: string }[]>) {
    const epic = this.actor.spec.epics.find(e => e.id === id);
    if (!!feature.epic) {
      const index = feature.epic.features.indexOf(feature);
      feature.epic.features.splice(index, 1);
      this.manager.put(feature.epic);
    }

    epic.features.push(feature);
    feature.linking({epic: epic});
    this.manager.put(epic);

    this.version++;
  }

  trackFeature(index: number, feature: Feature) {
    return !!feature ? feature.id : null;
  }

  addFeature() {
    const feature = new Feature({
      id: shortid(),
      title: [new TextToken('Great feature')]
    });
    this.actor.features.push(feature);
    feature.linking({spec: this.actor.spec, actor: this.actor});

    this.manager.put(feature);
    this.manager.put(this.actor);

    this.version++;
  }

  deleteFeature(id: string) {
    this.instance.popover?.hide();
    let index = this.actor.features.findIndex(f => f.id === id);
    const feature = this.actor.features[index];
    this.actor.features.splice(index, 1);
    this.manager.put(this.actor);

    if (!!feature.epic) {
      index = feature.epic.features.findIndex(f => f.id === id);
      feature.epic.features.splice(index, 1);
      this.manager.put(feature.epic);
    }

    this.manager.remove(feature);

    this.version++;
  }

}
