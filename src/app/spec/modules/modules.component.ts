import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalService, PopoverInstance, UI } from '@junte/ui';
import { EditMode } from 'src/enums/edit-mode';
import { Language } from 'src/enums/language';
import { SpecManager } from 'src/managers/spec.manager';
import { Model, Module } from 'src/models/spec/planning/module';
import { Spec } from 'src/models/spec/spec';
import * as uuid from 'uuid/v1';
import { CURRENT_LANGUAGE } from '../../../consts';
import { LocalUI } from '../../../enums/local-ui';

@Component({
  selector: 'spec-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModulesComponent implements OnInit {

  ui = UI;
  language = Language;
  localUi = LocalUI;
  editMode = EditMode;
  consts = {language: CURRENT_LANGUAGE};

  spec: Spec;
  added: string;

  constructor(public manager: SpecManager,
              public modal: ModalService,
              public cd: ChangeDetectorRef,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.data.subscribe(({spec}) => this.spec = spec);
  }

  addModule() {
    const model = new Model({
      id: uuid()
    });
    this.manager.put(model);

    const module = new Module({
      id: uuid(),
      title: $localize`:@@label.new_module_example:Accepting payments`,
      model: model
    });
    this.spec.modules.push(module);
    module.linking(this.spec);

    this.manager.put(module);
    this.manager.put(this.spec);

    this.added = module.id;
    this.cd.detectChanges();
  }

  deleteModule(module: Module) {
    const links = module.delete();
    links.deleted.forEach(o => this.manager.remove(o));
    links.changed.forEach(o => this.manager.put(o));
    this.manager.remove(module);

    this.cd.detectChanges();
    this.modal.close();
  }

  moveModule(event: CdkDragDrop<Module[]>) {
    moveItemInArray(this.spec.modules, event.previousIndex, event.currentIndex);
    this.manager.put(this.spec);

    this.cd.detectChanges();
  }

  trackModule(index: number, module: Module) {
    return !!module ? module.id : null;
  }

}
