import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UI } from '@junte/ui';
import { CURRENT_LANGUAGE } from '../../../../consts';
import { EditMode } from '../../../../enums/edit-mode';
import { Language } from '../../../../enums/language';
import { LocalUI } from '../../../../enums/local-ui';
import { ResourceType, Spec } from '../../../../models/spec/spec';
import { MeUser } from '../../../../models/user';
import { SpecManager } from '../../managers';

@Component({
  selector: 'spec-resource-types',
  templateUrl: './resource-types.component.html',
  styleUrls: ['./resource-types.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourceTypesComponent implements OnInit {

  ui = UI;
  language = Language;
  localUi = LocalUI;
  editMode = EditMode;
  consts = {language: CURRENT_LANGUAGE};

  private _spec: Spec;

  progress = {restore: false};
  me: MeUser;

  set spec(spec: Spec) {
    this._spec = spec;

    spec.resourceTypes.forEach(({title, hourRate}) => {
      const g = this.resourceTypesGroup();
      g.patchValue({title, hourRate});
      this.resourceTypesArray.push(g);
    });
  }

  get spec() {
    return this._spec;
  }

  resourceTypesArray = this.fb.array([]);
  form = this.fb.group({resourceTypes: this.resourceTypesArray});

  constructor(private fb: FormBuilder,
              private manager: SpecManager,
              private cd: ChangeDetectorRef,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.data.subscribe(({spec}) => this.spec = spec);

    this.manager.mode$.subscribe(mode => {
      mode === EditMode.edit
        ? this.form.enable() : this.form.disable();
      this.cd.markForCheck();
    });

    this.form.valueChanges.subscribe(() => {
      const {resourceTypes} = this.form.getRawValue();
      this.spec.resourceTypes = resourceTypes.map(({title, hourRate}) =>
        new ResourceType({title, hourRate: +hourRate}));

      this.manager.put(this.spec);
    });
  }

  resourceTypesGroup() {
    return this.fb.group({
      title: [null, [Validators.required]],
      hourRate: [null, [Validators.required]]
    });
  }

  fillResources() {
    let group = this.resourceTypesGroup();
    group.patchValue({title: 'UI/UX', hourRate: 25});
    this.resourceTypesArray.push(group);

    group = this.resourceTypesGroup();
    group.patchValue({title: 'Frontend', hourRate: 30});
    this.resourceTypesArray.push(group);

    group = this.resourceTypesGroup();
    group.patchValue({title: 'Backend', hourRate: 30});
    this.resourceTypesArray.push(group);

    group = this.resourceTypesGroup();
    group.patchValue({title: 'DevOps', hourRate: 40});
    this.resourceTypesArray.push(group);
  }

  addResource() {
    this.resourceTypesArray.push(this.resourceTypesGroup());
  }

  deleteResourceType(index: number) {
    this.resourceTypesArray.removeAt(index);
  }

}
