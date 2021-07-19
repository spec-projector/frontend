import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
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
import { Enum } from '../../../../models/spec/orm/enum';
import { trackElement } from '../../../../utils/templates';

@Component({
  selector: 'spec-enums',
  templateUrl: './enums.component.html',
  styleUrls: ['./enums.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnumsComponent implements OnInit, OnDestroy {

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
              private cd: ChangeDetectorRef,
              public modal: ModalService,
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

  addEnum() {
    const enum_ = new Enum({
      title: $localize`:@@label.new_enum_title:Gender`,
      name: $localize`:@@label.new_enum_name:gender`
    });
    enum_.linking({spec: this.spec});
    enum_.new();
    this.manager.put(enum_);

    this.spec.model.addEnum(enum_);
    this.manager.put(this.spec.model);

    this.added = enum_.id;
    this.version++;
    this.cd.detectChanges();
  }

  deleteEnum(enum_: Enum) {
    const links = enum_.delete();
    links.deleted.forEach(o => this.manager.remove(o));
    links.changed.forEach(o => this.manager.put(o));
    this.manager.remove(enum_);

    this.version++;
    this.cd.detectChanges();
    this.modal.close();
  }

  moveEnum(event: CdkDragDrop<Enum[]>) {
    const enums = event.container.data;
    const prev = enums[event.previousIndex];
    const next = enums[event.currentIndex];
    const sort = next.sort;
    next.sort = prev.sort;
    prev.sort = sort;

    this.manager.put(prev);
    this.manager.put(next);

    this.version++;
    this.cd.detectChanges();
  }

}
