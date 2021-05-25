import { ChangeDetectorRef, Component, ComponentFactoryResolver, Inject, Injector, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModalService, UI } from '@junte/ui';
import { merge, Subscription } from 'rxjs';
import { SpecManager } from 'src/app/spec/managers';
import { EditMode } from 'src/enums/edit-mode';
import { Language } from 'src/enums/language';
import { LocalUI } from 'src/enums/local-ui';
import { Spec } from 'src/models/spec/spec';
import { CURRENT_LANGUAGE } from '../../consts';
import { Project } from '../../models/projects';
import { EditProjectComponent } from '../projects/edit-project/edit-project.component';
import { ShareProjectComponent } from '../projects/share-project/share-project.component';
import { ReplicationState } from './enums';

@Component({
  selector: 'app-spec',
  templateUrl: './spec.component.html',
  styleUrls: ['./spec.component.scss']
})
export class SpecComponent implements OnInit, OnDestroy {

  ui = UI;
  language = Language;
  localUi = LocalUI;
  replicationState = ReplicationState;
  consts = {language: CURRENT_LANGUAGE};

  private subscriptions: {
    spec?: Subscription
  } = {};

  private _spec: Spec;

  set spec(spec: Spec) {
    this._spec = spec;
    this.subscriptions.spec?.unsubscribe();
    this.subscriptions.spec = merge(spec.replicated$, spec.updated$)
      .subscribe(() => this.cd.markForCheck());
  }

  get spec() {
    return this._spec;
  }

  project: Project;

  lockControl = this.fb.control(false);
  form = this.fb.group({mode: this.lockControl});

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private manager: SpecManager,
              private modal: ModalService,
              private cd: ChangeDetectorRef,
              private injector: Injector,
              private cfr: ComponentFactoryResolver) {
  }

  ngOnInit() {
    this.route.data.subscribe(({project, spec}) =>
      [this.project, this.spec] = [project, spec]);

    this.lockControl.valueChanges.subscribe(mode =>
      this.manager.mode = mode ? EditMode.view : EditMode.edit);
  }

  ngOnDestroy() {
    console.log('destroy');
    this.manager.clear();

    [this.subscriptions.spec]
      .forEach(s => s?.unsubscribe());
  }

  shareProject() {
    const factory = this.cfr.resolveComponentFactory(ShareProjectComponent);
    const component = factory.create(this.injector);
    component.instance.project = this.project;
    component.instance.saved.subscribe(p => {
      this.project = p;
      this.modal.close();
    });
    this.modal.open(component, {title: {icon: LocalUI.icons.share, text: 'Share project'}});
  }
}
