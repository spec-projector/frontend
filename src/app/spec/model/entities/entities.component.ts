import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService, UI } from '@junte/ui';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SpecManager } from 'src/app/spec/managers/spec';
import { EditMode } from 'src/enums/edit-mode';
import { Language } from 'src/enums/language';
import { Spec } from 'src/models/spec/spec';
import { CURRENT_LANGUAGE } from '../../../../consts';
import { LocalUI } from '../../../../enums/local-ui';
import { Entity } from '../../../../models/spec/orm/entity';
import { trackElement } from '../../../../utils/templates';

@Component({
  selector: 'spec-entities',
  templateUrl: './entities.component.html',
  styleUrls: ['./entities.component.scss']
})
export class EntitiesComponent implements OnInit, OnDestroy {

  ui = UI;
  localUi = LocalUI;
  language = Language;
  editMode = EditMode;
  trackElement = trackElement;
  consts = {language: CURRENT_LANGUAGE};

  private destroyed$ = new Subject();

  spec: Spec;
  version = 0;
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

  addEntity() {
    const entity = new Entity({
      title: $localize`:@@label.new_entity_title:Client`,
      name: $localize`:@@label.new_entity_name:client`
    });
    entity.linking({spec: this.spec});
    entity.new();
    this.manager.put(entity);

    this.spec.model.addEntity(entity);
    this.manager.put(this.spec.model);

    this.added = entity.id;
    this.version++;
    this.cd.detectChanges();
  }

  deleteEntity(entity: Entity) {
    const links = entity.delete();
    links.deleted.forEach(o => this.manager.remove(o));
    links.changed.forEach(o => this.manager.put(o));
    this.manager.remove(entity);

    this.version++;
    this.cd.detectChanges();
    this.modal.close();
  }

  moveEntity(event: CdkDragDrop<Entity[]>) {
    const entities = event.container.data;
    const prev = entities[event.previousIndex];
    const next = entities[event.currentIndex];
    const sort = next.sort;
    next.sort = prev.sort;
    prev.sort = sort;

    this.manager.put(prev);
    this.manager.put(next);

    this.version++;
    this.cd.detectChanges();
  }

}
