import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UI } from '@junte/ui';
import { delay, finalize } from 'rxjs/operators';
import { SpecManager } from 'src/managers/spec.manager';
import { EditMode } from 'src/enums/edit-mode';
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
  localUi = LocalUI;
  editMode = EditMode;
  progress = {restore: false};

  set spec(spec: Spec) {
    this._spec = spec;

    this.form.patchValue({
      description: spec.description,
      author: spec.author,
      gitLabKey: spec.integration.gitLabKey,
      gitHubKey: spec.integration.gitHubKey,
      figmaKey: spec.integration.figmaKey,
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
    gitLabKey: [],
    gitHubKey: [],
    figmaKey: [],
    graphqlPlaygroundUrl: [],
    resourceTypes: this.resourceTypesArray
  });

  constructor(private fb: FormBuilder,
              public manager: SpecManager,
              private route: ActivatedRoute) {
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
      gitLabKey,
      gitHubKey,
      figmaKey,
      graphqlPlaygroundUrl,
      resourceTypes
    } = this.form.getRawValue();

    [this.spec.description,
      this.spec.author,
      this.spec.integration.gitLabKey,
      this.spec.integration.gitHubKey,
      this.spec.integration.figmaKey,
      this.spec.integration.graphqlPlaygroundUrl,
      this.spec.resourceTypes]
      = [description,
      author,
      gitLabKey,
      gitHubKey,
      figmaKey,
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
