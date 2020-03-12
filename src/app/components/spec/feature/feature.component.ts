import { Component, ComponentFactoryResolver, ElementRef, EventEmitter, Injector, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ModalService, PopoverService, UI } from 'junte-ui';
import { ClipboardService } from 'ngx-clipboard';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { FeatureMarkdownComponent } from 'src/app/components/spec/feature/markdown/feature-markdown.component';
import { LocalUI } from 'src/app/enums/local-ui';
import { SpecManager } from 'src/app/managers/spec.manager';
import { EditMode } from 'src/app/model/enums/edit-mode';
import { Feature, Resource, StoryEntry } from 'src/app/model/spec/planning/feature';
import { Frame } from 'src/app/model/spec/planning/frame';
import { Issue } from 'src/app/model/spec/planning/issue';
import { Token } from 'src/app/model/spec/planning/token';
import { Graphql } from '../../../model/spec/planning/graphql';

@Component({
    selector: 'spec-feature',
    templateUrl: './feature.component.html',
    styleUrls: ['./feature.component.scss']
})
export class FeatureComponent {

    ui = UI;
    localUi = LocalUI;
    editMode = EditMode;

    private _feature: Feature;
    private subscriptions: { form: Subscription } = {form: null};

    @ViewChild('summary', {static: false})
    summary: FeatureMarkdownComponent;

    mode = EditMode.view;

    markdown = false;

    title = new FormControl();
    form = this.fb.group({
        title: this.title
    });

    @Input()
    opened = false;

    @Input()
    set feature(feature: Feature) {
        if (!!this.subscriptions.form) {
            this.subscriptions.form.unsubscribe();
        }
        this._feature = feature;
        this.updateForm();

        feature.changes.subscribe(() => this.updateForm());

        this.subscriptions.form = this.form.valueChanges
            .subscribe(() => {
                const {title} = this.form.getRawValue();
                this.feature.title = Token.parse(title);
                this.manager.put(this.feature);
            });
    }

    get feature() {
        return this._feature;
    }

    @Output()
    selected = new EventEmitter();

    constructor(public manager: SpecManager,
                private clipboard: ClipboardService,
                private fb: FormBuilder,
                private popover: PopoverService,
                private injector: Injector,
                private cfr: ComponentFactoryResolver,
                private modal: ModalService,
                private logger: NGXLogger,
                public hostRef: ElementRef) {
    }

    private updateForm() {
        this.form.patchValue({
            title: this.feature.title.map(t => t.toString()).join(' ')
        });
    }

    copyMarkdown() {
        const summary = this.summary.getMarkdown();
        console.log(summary);
        this.markdown = true;
        this.clipboard.copyFromContent(summary);
        setTimeout(() => this.markdown = false, 20000);
    }

    saveStory(story: StoryEntry[]) {
        this.logger.log('save story for feature [', this.feature.title.toString(), ']');
        this.feature.story = story;
        this.manager.put(this.feature);

        this.feature.version++;
    }

    saveResources(resources: Resource[]) {
        this.logger.log('save resources for feature [', this.feature.title.toString(), ']');
        this.feature.resources = resources;
        this.manager.put(this.feature);

        this.feature.version++;
    }

    saveFrames(frames: Frame[]) {
        this.logger.log('save frames for feature [', this.feature.title.toString(), ']');
        this.feature.frames = frames;
        this.manager.put(this.feature);

        this.feature.version++;
    }

    saveIssues(issues: Issue[]) {
        this.feature.issues = issues;
        this.manager.put(this.feature);

        this.feature.version++;
    }

    saveApi({graphql}: { graphql?: Graphql[] }) {
        if (!!graphql) {
            this.feature.graphql = graphql;
        }
        this.manager.put(this.feature);

        this.feature.version++;
    }

}
