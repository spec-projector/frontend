import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService, UI } from '@junte/ui';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SpecManager } from 'src/app/spec/managers/spec';
import { EditMode } from 'src/enums/edit-mode';
import { Language } from 'src/enums/language';
import { Actor } from 'src/models/spec/planning/actor';
import { Spec } from 'src/models/spec/spec';
import { CURRENT_LANGUAGE } from '../../../consts';
import { LocalUI } from '../../../enums/local-ui';
import { trackElement } from '../../../utils/templates';
import { AnalyticsType } from 'src/enums/analyticsType';

@Component({
  selector: 'spec-actors',
  templateUrl: './actors.component.html',
  styleUrls: ['./actors.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActorsComponent implements OnInit, OnDestroy {

  ui = UI;
  localUi = LocalUI;
  language = Language;
  editMode = EditMode;
  trackElement = trackElement;
  consts = {language: CURRENT_LANGUAGE};
  analyticsType = AnalyticsType;

  private destroyed$ = new Subject();
  private _spec: Spec;

  set spec(spec: Spec) {
    this._spec = spec;
    spec.replicated$.pipe(takeUntil(this.destroyed$))
      .subscribe(() => this.cd.detectChanges());
  }

  get spec() {
    return this._spec;
  }

  added: string;

  constructor(public manager: SpecManager,
              public modal: ModalService,
              private cd: ChangeDetectorRef,
              public route: ActivatedRoute,
              public router: Router) {
  }

  ngOnInit() {
    this.route.data.pipe(takeUntil(this.destroyed$))
      .subscribe(({spec}) => this.spec = spec);
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  addActor() {
    const actor = new Actor({
      name: $localize`:@@label.new_actor_example:Client`
    });
    actor.new();
    this.spec.actors.push(actor);
    actor.linking(this.spec);

    this.manager.put(actor);
    this.manager.put(this.spec);

    this.added = actor.id;
    this.cd.detectChanges();
  }

  deleteActor(actor: Actor) {
    const links = actor.delete();
    links.deleted.forEach(o => this.manager.remove(o));
    links.changed.forEach(o => this.manager.put(o));
    this.manager.remove(actor);

    this.cd.detectChanges();
    this.modal.close();
  }

  moveActor(event: CdkDragDrop<Actor[]>) {
    moveItemInArray(this.spec.actors, event.previousIndex, event.currentIndex);
    this.manager.put(this.spec);

    this.cd.detectChanges();
  }
}
