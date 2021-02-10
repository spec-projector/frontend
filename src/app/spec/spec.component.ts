import { Component, Inject, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UI } from '@junte/ui';
import { Language } from 'src/enums/language';
import { LocalUI } from 'src/enums/local-ui';
import { SpecManager } from 'src/managers/spec.manager';
import { EditMode } from 'src/enums/edit-mode';
import { Spec } from 'src/model/spec/spec';
import { ValidationError } from 'src/model/validation/error';

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
  errors: ValidationError[] = [];

  editModeControl = this.fb.control(true);
  form = this.fb.group({mode: this.editModeControl});

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private manager: SpecManager,
              @Inject(LOCALE_ID) public locale: string) {
  }

  ngOnInit() {
    this.route.data.subscribe(({spec}) => this.spec = spec);

    this.editModeControl.valueChanges.subscribe(mode =>
      this.manager.mode = mode ? EditMode.edit : EditMode.view);
  }

  ngOnDestroy() {
    console.log('destroy');
    this.manager.clear();
  }
}
