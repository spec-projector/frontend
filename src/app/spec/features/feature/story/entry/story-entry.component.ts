import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UI } from '@junte/ui';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { EditMode } from 'src/enums/edit-mode';
import { StoryEntry, StoryEntryType } from 'src/model/spec/planning/feature';
import { Token } from 'src/model/spec/planning/token';
import { Spec } from 'src/model/spec/spec';
import { config } from 'src/environments/environment';
import { SpecManager } from '../../../../../../managers/spec.manager';

@Component({
  selector: 'spec-story-entry',
  templateUrl: './story-entry.component.html',
  styleUrls: ['./story-entry.component.scss']
})
export class StoryEntryComponent {

  ui = UI;
  editMode = EditMode;
  storyEntryType = StoryEntryType;

  private subscriptions: { form: Subscription } = {form: null};

  @ViewChild('input', {static: false})
  input: ElementRef<HTMLInputElement>;

  private _entry: StoryEntry;

  @Input()
  spec: Spec;

  @Input()
  set entry(field: StoryEntry) {
    if (!!this.subscriptions.form) {
      this.subscriptions.form.unsubscribe();
    }
    this._entry = field;
    this.form.patchValue({
      type: field.type,
      description: field.description.map(t => t.toString()).join(' ')
    });

    this.subscriptions.form = this.form.valueChanges
      .pipe(debounceTime(config.uiDebounceTime))
      .subscribe(() => {
        const {type, description} = this.form.getRawValue();
        console.log(Token.parse(description));
        [this.entry.type, this.entry.description] = [type, Token.parse(description)];
        this.changed.emit(this.entry);
      });
  }

  get entry() {
    return this._entry;
  }

  mode = EditMode.view;

  @Output()
  changed = new EventEmitter<StoryEntry>();

  @Output()
  up = new EventEmitter();

  @Output()
  down = new EventEmitter();

  @Output()
  finished = new EventEmitter();

  @Output()
  deleted = new EventEmitter();

  typeControl = this.fb.control(null);
  descriptionControl = this.fb.control(null);
  form = this.fb.group({
    type: this.typeControl,
    description: this.descriptionControl
  });

  constructor(public manager: SpecManager,
              private fb: FormBuilder) {
  }

  keydown(e: KeyboardEvent) {
    if (e.code === 'Tab') {
      e.preventDefault();
      this.typeControl.setValue(this.typeControl.value === StoryEntryType.can
        ? StoryEntryType.see : StoryEntryType.can);
    } else if (e.code === 'ArrowUp') {
      e.preventDefault();
      this.up.emit();
    } else if (e.code === 'ArrowDown') {
      e.preventDefault();
      this.down.emit();
    } else if (e.code === 'Enter') {
      this.finished.emit();
    }
  }

  keyup(e: KeyboardEvent) {
    if (e.code === 'Backspace' && !this.descriptionControl.value) {
      this.deleted.emit();
    }
  }

  unfocus() {
    this.mode = EditMode.view;
  }

  focus() {
    this.mode = EditMode.edit;
    const el = this.input.nativeElement;
    setTimeout(() => {
      el.focus();
      el.selectionStart = 0;
      el.selectionEnd = el.value.length;
    }, 0);
  }

}
