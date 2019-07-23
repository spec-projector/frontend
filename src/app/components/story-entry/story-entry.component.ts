import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { EditMode } from 'src/enums/edit-mode';
import { UI } from 'junte-ui';
import { StoryEntry, StoryEntryType } from 'src/model/planning/feature';
import { Token } from 'src/model/planning/token';
import { filter, tap } from 'rxjs/operators';

@Component({
    selector: 'spec-story-entry',
    templateUrl: './story-entry.component.html',
    styleUrls: ['./story-entry.component.scss']
})
export class StoryEntryComponent implements OnInit {

    ui = UI;
    editMode = EditMode;
    storyEntryType = StoryEntryType;

    @ViewChild('input', {static: false})
    input: HTMLInputElement;

    private _entry: StoryEntry;

    @Input() set entry(field: StoryEntry) {
        this._entry = field;
        this.form.patchValue({
            type: field.type,
            description: field.description.map(t => t.toString()).join(' ')
        });
    }

    get entry() {
        return this._entry;
    }

    @Output() changed = new EventEmitter<StoryEntry>();
    @Output() finished = new EventEmitter();
    @Output() deleted = new EventEmitter();

    type = new FormControl();
    description = new FormControl();

    form = this.formBuilder.group({
        type: this.type,
        description: this.description
    });

    @Input()
    mode = EditMode.view;

    constructor(private formBuilder: FormBuilder) {
        this.form.valueChanges
            .pipe(filter(() => !!this.entry),
                tap(() => {
                    const value = this.form.getRawValue();
                    this.entry.type = value.type;
                    this.entry.description = Token.parse(value.description);
                }))
            .subscribe(() => this.changed.emit(this.entry));
    }

    ngOnInit() {
    }

    keyup(e: KeyboardEvent) {
        if (e.code === 'Enter') {
            this.finished.emit();
        } else if (e.code === 'Backspace' && !this.description.value) {
            this.deleted.emit();
        }
    }

}
