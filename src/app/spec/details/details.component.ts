import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UI } from '@junte/ui';
import { delay, finalize } from 'rxjs/operators';
import { EditMode } from 'src/enums/edit-mode';
import { Language } from 'src/enums/language';
import { SpecManager } from 'src/managers/spec.manager';
import { ResourceType, Spec } from 'src/model/spec/spec';
import { LocalUI } from '../../../enums/local-ui';

@Component({
  selector: 'spec-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  _spec: Spec;

  ui = UI;
  language = Language;
  localUi = LocalUI;
  editMode = EditMode;
  progress = {restore: false};

  set spec(spec: Spec) {
    this._spec = spec;

    this.form.patchValue({
      description: spec.description,
      author: spec.author,
      graphqlPlaygroundUrl: spec.integration.graphqlPlaygroundUrl
    }, {emitEvent: false});

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

  form = this.fb.group({
    description: [null],
    author: [null],
    figmaKey: [],
    graphqlPlaygroundUrl: [],
    resourceTypes: this.resourceTypesArray
  });

  constructor(@Inject(LOCALE_ID) public locale: string,
              private fb: FormBuilder,
              public manager: SpecManager,
              public route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.data.subscribe(({spec}) => this.spec = spec);

    this.form.valueChanges.pipe(delay(2000)).subscribe(() => this.save());
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

  save() {
    const {
      description,
      author,
      figmaKey,
      graphqlPlaygroundUrl,
      resourceTypes
    } = this.form.getRawValue();

    [this.spec.description,
      this.spec.author,
      this.spec.integration.graphqlPlaygroundUrl,
      this.spec.resourceTypes]
      = [description,
      author,
      graphqlPlaygroundUrl,
      resourceTypes.map(({title, hourRate}) =>
        new ResourceType({title, hourRate: +hourRate}))];

    this.manager.put(this.spec);

  }

  dump(element: HTMLAnchorElement) {
    this.manager.dump()
      .subscribe(dump => {
        const file = new Blob([JSON.stringify(dump, null, 4)],
          {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = 'dump.json';
        element.click();
      });
  }

  restore({target: {files: [file]}}) {
    this.progress.restore = true;
    const reader = new FileReader();
    reader.onload = () => {
      const docs = JSON.parse(reader.result.toString());
      this.manager.restore(docs)
        .pipe(finalize(() => this.progress.restore = false))
        .subscribe(() => document.location.reload());
    };
    reader.readAsText(file);
  }

}
