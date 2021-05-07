import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UI } from '@junte/ui';
import { generate as shortid } from 'shortid';
import { Frame } from 'src/models/spec/planning/feature/frame';
import { SpecManager } from '../../../../managers';

@Component({
  selector: 'spec-feature-add-frame',
  templateUrl: './feature-add-frame.component.html',
  styleUrls: ['./feature-add-frame.component.scss']
})
export class FeatureAddFrameComponent {

  ui = UI;

  form = this.fb.group({
    url: [null, [Validators.required]]
  });

  @Output()
  added = new EventEmitter<Frame>();

  constructor(private manager: SpecManager,
              private fb: FormBuilder) {
  }

  add() {
    const {url} = this.form.getRawValue();
    const frame = new Frame({url});
    frame.new();
    this.manager.put(frame);

    this.added.emit(frame);
  }

}
