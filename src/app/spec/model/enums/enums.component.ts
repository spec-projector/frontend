import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService, PopoverInstance, PopoverService, UI } from '@junte/ui';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { generate as shortid } from 'shortid';
import { EditMode } from 'src/enums/edit-mode';
import { Language } from 'src/enums/language';
import { SpecManager } from 'src/managers/spec.manager';
import { Spec } from 'src/models/spec/spec';
import { CURRENT_LANGUAGE } from '../../../../consts';
import { LocalUI } from '../../../../enums/local-ui';
import { Enum } from '../../../../models/spec/orm/enum';

@Component({
  selector: 'spec-enums',
  templateUrl: './enums.component.html',
  styleUrls: ['./enums.component.scss']
})
export class EnumsComponent implements OnInit, OnDestroy {

  ui = UI;
  localUi = LocalUI;
  language = Language;
  editMode = EditMode;
  consts = {language: CURRENT_LANGUAGE};

  private destroyed$ = new Subject();

  spec: Spec;
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
      id: shortid(),
      title: $localize`:@@label.new_enum_title_example:Enum`,
      name: $localize`:@@label.new_enum_name_example:Enum`,
    });
    this.spec.model.enums.push(enum_);
    enum_.linking({spec: this.spec});

    this.manager.put(enum_);
    this.manager.put(this.spec.model);
    this.manager.put(this.spec);

    this.added = enum_.id;
    this.cd.detectChanges();
  }

  deleteEnum(enum_: Enum) {
    const links = enum_.delete();
    links.deleted.forEach(o => this.manager.remove(o));
    links.changed.forEach(o => this.manager.put(o));
    this.manager.remove(enum_);

    this.cd.detectChanges();
    this.modal.close();
  }

  moveEnum(event: CdkDragDrop<Enum[]>) {
    moveItemInArray(this.spec.model.enums, event.previousIndex, event.currentIndex);
    this.manager.put(this.spec.model);

    this.cd.detectChanges();
  }

  trackEnum(index: number, enum_: Enum) {
    return !!enum_ ? enum_.id : null;
  }

}
