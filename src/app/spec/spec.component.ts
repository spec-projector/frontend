import { Component, ComponentFactoryResolver, Inject, Injector, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService, UI } from '@junte/ui';
import { Language } from 'src/enums/language';
import { LocalUI } from 'src/enums/local-ui';
import { SpecManager } from 'src/managers/spec.manager';
import { EditMode } from 'src/enums/edit-mode';
import { Spec } from 'src/model/spec/spec';
import { ValidationError } from 'src/model/validation/error';
import { Project } from '../../model/projects';
import { EditProjectComponent } from '../projects/edit-project/edit-project.component';

@Component({
  selector: 'app-spec',
  templateUrl: './spec.component.html',
  styleUrls: ['./spec.component.scss']
})
export class SpecComponent implements OnInit, OnDestroy {

  ui = UI;
  language = Language;
  localUi = LocalUI;

  spec: Spec;
  project: Project;
  errors: ValidationError[] = [];

  editModeControl = this.fb.control(true);
  form = this.fb.group({mode: this.editModeControl});

  constructor(@Inject(LOCALE_ID) public locale: string,
              private fb: FormBuilder,
              private route: ActivatedRoute,
              private manager: SpecManager,
              private modal: ModalService,
              private injector: Injector,
              private cfr: ComponentFactoryResolver) {
  }

  ngOnInit() {
    this.route.data.subscribe(({project, spec}) =>
      [this.project, this.spec] = [project, spec]);

    this.editModeControl.valueChanges.subscribe(mode =>
      this.manager.mode = mode ? EditMode.edit : EditMode.view);
  }

  ngOnDestroy() {
    console.log('destroy');
    this.manager.clear();
  }

  editProject() {
    const factory = this.cfr.resolveComponentFactory(EditProjectComponent);
    const component = factory.create(this.injector);
    component.instance.project = this.project;
    component.instance.saved.subscribe(p => {
      this.project = p;
      this.modal.close();
    });
    this.modal.open(component, {title: {icon: LocalUI.icons.project, text: 'Edit project'}});
  }
}
