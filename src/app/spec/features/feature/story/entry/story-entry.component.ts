import { Component, ElementRef, EventEmitter, HostBinding, Inject, Input, LOCALE_ID, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UI } from '@junte/ui';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { EditMode } from 'src/enums/edit-mode';
import { Token } from 'src/models/spec/planning/token';
import { Spec } from 'src/models/spec/spec';
import { CURRENT_LANGUAGE, UI_DELAY } from '../../../../../../consts';
import { Language } from '../../../../../../enums/language';
import { StoryEntry, StoryEntryType } from '../../../../../../models/spec/planning/feature/story';
import { SpecManager } from '../../../../managers';

@Component({
    selector: 'spec-story-entry',
    templateUrl: './story-entry.component.html',
    styleUrls: ['./story-entry.component.scss']
})
export class FeatureStoryEntryComponent {

    ui = UI;
    editMode = EditMode;
    storyEntryType = StoryEntryType;
    language = Language;
    consts = {language: CURRENT_LANGUAGE};

    private subscriptions: { form: Subscription } = {form: null};

    @ViewChild('inputRef', {static: false})
    inputRef: ElementRef<HTMLInputElement>;

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
            .pipe(debounceTime(UI_DELAY))
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
        const el = this.inputRef.nativeElement;
        setTimeout(() => {
            el.focus();
            el.selectionStart = 0;
            el.selectionEnd = el.value.length;
        }, 100);
    }

}
