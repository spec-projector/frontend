import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService, PopoverInstance, PopoverService, UI } from '@junte/ui';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { generate as shortid } from 'shortid';
import { EditMode } from 'src/enums/edit-mode';
import { Language } from 'src/enums/language';
import { SpecManager } from 'src/managers/spec.manager';
import { Actor } from 'src/models/spec/planning/actor';
import { Spec } from 'src/models/spec/spec';
import { CURRENT_LANGUAGE } from '../../../consts';
import { LocalUI } from '../../../enums/local-ui';

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
  consts = {language: CURRENT_LANGUAGE};

  private destroyed$ = new Subject();

  spec: Spec;
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
      id: shortid(),
      name: $localize`:@@label.new_actor_example:Client`
    });
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

  trackActor(index: number, actor: Actor) {
    return !!actor ? actor.id : null;
  }
}
