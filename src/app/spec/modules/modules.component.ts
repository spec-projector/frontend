import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalService, UI } from '@junte/ui';
import { generate as shortid } from 'shortid';
import { EditMode } from 'src/enums/edit-mode';
import { Language } from 'src/enums/language';
import { SpecManager } from 'src/app/spec/managers';
import { ModuleModel, Module } from 'src/models/spec/planning/module';
import { Spec } from 'src/models/spec/spec';
import { CURRENT_LANGUAGE } from '../../../consts';
import { LocalUI } from '../../../enums/local-ui';
import { trackElement } from '../../../utils/templates';

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
  trackElement = trackElement;
  consts = {language: CURRENT_LANGUAGE};

  spec: Spec;
  version = 0;
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
    const model = new ModuleModel({
      id: shortid()
    });
    this.manager.put(model);

    const module = new Module({
      id: shortid(),
      title: $localize`:@@label.new_module_example:Accepting payments`,
      model: model
    });
    this.spec.modules.push(module);
    module.linking(this.spec);

    this.manager.put(module);
    this.manager.put(this.spec);

    this.added = module.id;
    this.version++;
    this.cd.detectChanges();
  }

  deleteModule(module: Module) {
    const links = module.delete();
    links.deleted.forEach(o => this.manager.remove(o));
    links.changed.forEach(o => this.manager.put(o));
    this.manager.remove(module);

    this.version++;
    this.cd.detectChanges();
    this.modal.close();
  }

  moveModule(event: CdkDragDrop<Module[]>) {
    moveItemInArray(this.spec.modules, event.previousIndex, event.currentIndex);
    this.manager.put(this.spec);

    this.version++;
    this.cd.detectChanges();
  }

}
