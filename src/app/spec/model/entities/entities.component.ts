import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService, UI } from '@junte/ui';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { generate as shortid } from 'shortid';
import { EditMode } from 'src/enums/edit-mode';
import { Language } from 'src/enums/language';
import { SpecManager } from 'src/managers/spec.manager';
import { Spec } from 'src/models/spec/spec';
import { CURRENT_LANGUAGE } from '../../../../consts';
import { LocalUI } from '../../../../enums/local-ui';
import { Entity } from '../../../../models/spec/orm/entity';

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

  addEntity() {
    const entity = new Entity({
      id: shortid(),
      title: $localize`:@@label.new_entity_title_example:Entity`,
      name: $localize`:@@label.new_entity_name_example:entity`,
    });
    this.spec.model.entities.unshift(entity);
    entity.linking({spec: this.spec});

    this.manager.put(entity);
    this.manager.put(this.spec.model);
    this.manager.put(this.spec);

    this.added = entity.id;
    this.cd.detectChanges();
  }

  deleteEntity(entity: Entity) {
    const links = entity.delete();
    links.deleted.forEach(o => this.manager.remove(o));
    links.changed.forEach(o => this.manager.put(o));
    this.manager.remove(entity);

    this.cd.detectChanges();
    this.modal.close();
  }

  moveEntity(event: CdkDragDrop<Entity[]>) {
    moveItemInArray(this.spec.model.entities, event.previousIndex, event.currentIndex);
    this.manager.put(this.spec.model);

    this.cd.detectChanges();
  }

  trackEntity(index: number, entity: Entity) {
    return !!entity ? entity.id : null;
  }

}
