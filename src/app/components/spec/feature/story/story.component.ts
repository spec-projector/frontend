import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UI } from 'junte-ui';
import { SpecManager } from 'src/app/managers/spec.manager';
import { EditMode } from 'src/app/model/enums/edit-mode';
import { StoryEntry, StoryEntryType } from 'src/app/model/spec/planning/feature';
import { TextToken } from 'src/app/model/spec/planning/token';
import { Spec } from 'src/app/model/spec/spec';

@Component({
    selector: 'spec-story',
    templateUrl: './story.component.html',
    styleUrls: ['./story.component.scss']
})
export class StoryComponent implements OnInit {

    ui = UI;
    mode = EditMode.view;
    editMode = EditMode;

    @Input()
    spec: Spec;

    @Input()
    story: StoryEntry[] = [];

    @Output()
    changed = new EventEmitter<StoryEntry[]>();

    constructor(public manager: SpecManager) {
    }

    ngOnInit() {
    }

    fill() {
        const entry = new StoryEntry({
            type: StoryEntryType.see,
            description: [new TextToken('something...')]
        });
        this.story.push(entry);
        this.changed.emit(this.story);
    }

    add(index: number) {
        const entry = new StoryEntry({
            type: StoryEntryType.see,
            description: [new TextToken('something...')]
        });
        this.story.splice(index + 1, 0, entry);
        this.changed.emit(this.story);
    }

    save(index: number, entry: StoryEntry) {
        this.story[index] = entry;
        this.changed.emit(this.story);
    }

    delete(index: number) {
        this.story.splice(index, 1);
        this.changed.emit(this.story);
    }

}
