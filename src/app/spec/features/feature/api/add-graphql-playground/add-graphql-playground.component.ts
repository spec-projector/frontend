import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UI } from '@junte/ui';
import { CURRENT_LANGUAGE } from '../../../../../../consts';
import { Language } from '../../../../../../enums/language';
import { Spec } from '../../../../../../models/spec/spec';
import { SpecManager } from '../../../../managers/spec';
import * as assign from 'assign-deep';

@Component({
  selector: 'spec-add-graphql-playground',
  templateUrl: './add-graphql-playground.component.html',
  styleUrls: ['./add-graphql-playground.component.scss']
})
export class AddGraphqlPlaygroundComponent {

  ui = UI;
  language = Language;
  consts = {language: CURRENT_LANGUAGE};

  @Input()
  spec: Spec;

  @Output()
  updated = new EventEmitter();

  form = this.fb.group({
    graphqlPlaygroundUrl: [null, Validators.required]
  });

  constructor(private manager: SpecManager,
              private fb: FormBuilder) {
  }

  save() {
    const tools = this.form.getRawValue();
    assign(this.spec.tools, tools);
    this.manager.put(this.spec.tools);
    this.updated.emit();
  }

}
