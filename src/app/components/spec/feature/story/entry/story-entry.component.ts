import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { UI } from 'junte-ui';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { EditMode } from 'src/app/model/enums/edit-mode';
import { StoryEntry, StoryEntryType } from 'src/app/model/spec/planning/feature';
import { Token } from 'src/app/model/spec/planning/token';
import { Spec } from 'src/app/model/spec/spec';
import { config } from 'src/environments/environment';

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
    input: HTMLInputElement;

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

    @Input()
    mode = EditMode.view;

    @Output()
    changed = new EventEmitter<StoryEntry>();

    @Output()
    finished = new EventEmitter();

    @Output()
    deleted = new EventEmitter();

    type = new FormControl();
    description = new FormControl();

    form = this.formBuilder.group({
        type: this.type,
        description: this.description
    });

    constructor(private formBuilder: FormBuilder) {
    }

    keyup(e: KeyboardEvent) {
        if (e.code === 'Enter') {
            this.finished.emit();
        } else if (e.code === 'Backspace' && !this.description.value) {
            this.deleted.emit();
        }
    }

}
