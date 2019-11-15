import { Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { FramesStorage } from 'src/app/services/frames-storage.service';
import { SpecManager } from 'src/app/managers/spec.manager';
import { EditMode } from 'src/app/model/enums/edit-mode';
import * as Figma from 'figma-api';
import { UI } from 'junte-ui';
import { Feature, StoryEntry, StoryEntryType } from 'src/app/model/spec/planning/feature';
import { TextToken, Token, TokenType } from 'src/app/model/spec/planning/token';
import { ClipboardService } from 'ngx-clipboard';
import { filter, tap } from 'rxjs/operators';

@Component({
    selector: 'spec-feature',
    templateUrl: './feature.component.html',
    styleUrls: ['./feature.component.scss']
})
export class FeatureComponent implements OnInit {

    ui = UI;
    tokenType = TokenType;
    editMode = EditMode;

    private _feature: Feature;

    @ViewChild('summary', {static: false}) summary: ElementRef<HTMLElement>;

    @ViewChildren('storyEntry') entries: QueryList<StoryEntry>;

    mode = EditMode.view;
    storyMode = EditMode.view;
    opened = false;
    copied = false;

    title = new FormControl();
    form = this.formBuilder.group({
        title: this.title
    });

    @Input() set feature(feature: Feature) {
        this._feature = feature;
        this.updateForm();

        feature.changes.subscribe(() => this.updateForm());
    }

    get feature() {
        return this._feature;
    }

    figma = new Figma.Api({
        personalAccessToken: '12129-3a0f1d4d-ba86-4364-a226-954bd1c40120'
    });

    constructor(public manager: SpecManager,
                private clipboard: ClipboardService,
                public storage: FramesStorage,
                private formBuilder: FormBuilder) {

        this.form.valueChanges
            .pipe(filter(() => !!this.feature),
                tap(() => {
                    const value = this.form.getRawValue();
                    this.feature.title = Token.parse(value.title);
                }))
            .subscribe(() => this.manager.put(this.feature));

    }

    private updateForm() {
        this.form.patchValue({
            title: this.feature.title.map(t => t.toString()).join(' ')
        });
    }

    preview(file: string, node: string) {
        this.storage.set(file, node);

        this.figma.getImage(file, {ids: node, scale: 1.5, format: 'png'})
            .then(res => {
                if (!!res.images) {
                    this.storage.set(file, node, res.images.images[node]);
                }
            });
    }

    goto(url: string) {
        open(url);
    }

    ngOnInit() {
        // this.entries.changes.subscribe(s => console.log(s));
    }

    addStory() {
        const entry = new StoryEntry({
            type: StoryEntryType.see,
            description: [new TextToken('something...')]
        });
        this.feature.story.push(entry);
        this.manager.put(this.feature);
    }

    addStoryEntry(index: number) {
        const entry = new StoryEntry({
            type: StoryEntryType.see,
            description: [new TextToken('something...')]
        });
        this.feature.story.splice(index + 1, 0, entry);
        this.manager.put(this.feature);
    }

    deleteStoryEntry(index: number) {
        this.feature.story.splice(index, 1);
        this.manager.put(this.feature);
    }

    markdown() {
        const summary = this.summary.nativeElement;
        summary.style.display = 'block';
        this.clipboard.copyFromContent(summary.innerText);
        setTimeout(() => summary.style.display = 'none', 5000);
    }
}
