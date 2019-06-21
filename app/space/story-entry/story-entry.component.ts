import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {StoryEntry, StoryEntryType} from "../../../model/planning/feature";
import {FormBuilder, FormControl} from "@angular/forms";
import {EditMode} from "../../../enums/edit-mode";
import {filter, tap} from "rxjs/operators";
import {Token} from "../../../model/planning/token";

@Component({
    selector: 'app-story-entry',
    templateUrl: './story-entry.component.html',
    styleUrls: ['./story-entry.component.scss']
})
export class StoryEntryComponent implements OnInit {

    editMode = EditMode;
    storyEntryType = StoryEntryType;

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

    type = new FormControl();
    description = new FormControl();

    form = this.formBuilder.group({
        type: this.type,
        description: this.description
    });

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

}
