import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PopoverInstance, UI } from '@junte/ui';
import { filter, tap } from 'rxjs/operators';
import { SpecManager } from 'src/managers/spec.manager';
import { EditMode } from 'src/enums/edit-mode';
import { Epic } from 'src/model/spec/planning/epic';
import { Feature } from '../../../../model/spec/planning/feature';

@Component({
  selector: 'spec-epic',
  templateUrl: './epic.component.html',
  styleUrls: ['./epic.component.scss']
})
export class EpicComponent {

  ui = UI;
  editMode = EditMode;

  private _epic: Epic;

  instance: { popover: PopoverInstance } = {popover: null};

  mode = EditMode.view;

  title = new FormControl();
  form = this.fb.group({
    title: this.title
  });

  @Input()
  set epic(epic: Epic) {
    this._epic = epic;
    this.updateForm();

    epic.changes.subscribe(() => this.updateForm());
  }

  get epic() {
    return this._epic;
  }

  constructor(public manager: SpecManager,
              private fb: FormBuilder,
              public route: ActivatedRoute,
              public router: Router) {
    this.form.valueChanges
      .pipe(filter(() => !!this.epic),
        tap(() => Object.assign(this.epic, this.form.getRawValue())))
      .subscribe(() => this.manager.put(this.epic));
  }

  private updateForm() {
    this.form.patchValue({
      title: this.epic.title
    });
  }

  trackFeature(index: number, feature: Feature) {
    return !!feature ? feature.id : null;
  }

}
