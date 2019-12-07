import { Component, ComponentFactoryResolver, Injector, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import * as Figma from 'figma-api';
import { ModalOptions, ModalService, PopoverService, UI } from 'junte-ui';
import { ClipboardService } from 'ngx-clipboard';
import { filter, tap } from 'rxjs/operators';
import { FeatureEditGraphqlComponent } from 'src/app/components/spec/feature/edit-graphql/feature-edit-graphql.component';
import { FeatureMarkdownComponent } from 'src/app/components/spec/feature/markdown/feature-markdown.component';
import { LocalUI } from 'src/app/enums/local-ui';
import { SpecManager } from 'src/app/managers/spec.manager';
import { EditMode } from 'src/app/model/enums/edit-mode';
import { Feature, Resource, StoryEntry, StoryEntryType } from 'src/app/model/spec/planning/feature';
import { Frame } from 'src/app/model/spec/planning/frame';
import { Graphql } from 'src/app/model/spec/planning/graphql';
import { Issue } from 'src/app/model/spec/planning/issue';
import { TextToken, Token } from 'src/app/model/spec/planning/token';
import { FramesStorage } from 'src/app/services/frames-storage.service';

@Component({
    selector: 'spec-feature',
    templateUrl: './feature.component.html',
    styleUrls: ['./feature.component.scss']
})
export class FeatureComponent implements OnInit {

    ui = UI;
    localUi = LocalUI;
    editMode = EditMode;

    private _feature: Feature;

    @ViewChild('summary', {static: false})
    summary: FeatureMarkdownComponent;

    @ViewChildren('storyEntry')
    entries: QueryList<StoryEntry>;

    mode = EditMode.view;
    storyMode = EditMode.view;
    opened = false;
    markdown = false;

    title = new FormControl();
    form = this.fb.group({
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
        personalAccessToken: '26514-2ea7bfc4-e99d-4779-a77a-e1c9a269ee80'
    });

    constructor(public manager: SpecManager,
                private clipboard: ClipboardService,
                public storage: FramesStorage,
                private fb: FormBuilder,
                private popover: PopoverService,
                private injector: Injector,
                private cfr: ComponentFactoryResolver,
                private modal: ModalService) {

        this.form.valueChanges
            .pipe(filter(() => !!this.feature),
                tap(() => {
                    const {title} = this.form.getRawValue();
                    this.feature.title = Token.parse(title);
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
                    this.storage.set(file, node, {thumbnail: res.images[node]});
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

    copyMarkdown() {
        const summary = this.summary.getMarkdown();
        this.markdown = true;
        this.clipboard.copyFromContent(summary.innerText);
        setTimeout(() => this.markdown = false, 5000);
    }

    saveResources(resources: Resource[]) {
        this.feature.resources = resources;
        this.manager.put(this.feature);

        this.feature.version++;
    }

    saveIssues(issues: Issue[]) {
        this.feature.issues = issues;
        this.manager.put(this.feature);

        this.feature.version++;
    }

    addFrame(frame: Frame) {
        this.feature.frames.push(frame);
        this.manager.put(this.feature);

        this.popover.hide();
    }

    removeFrame(index: number) {
        this.feature.frames.splice(index, 1);
        this.manager.put(this.feature);
    }

    addGraphQL() {
        const component = this.cfr.resolveComponentFactory(FeatureEditGraphqlComponent)
            .create(this.injector);
        component.instance.spec = this.feature.spec;
        component.instance.saved.subscribe(q => {
            this.feature.graphql.push(q);
            this.manager.put(this.feature);
        });
        this.modal.open(component, new ModalOptions({
            title: {text: 'Add Graph QL', icon: LocalUI.icons.graphQl}
        }));
    }

    editGraphQL(query: Graphql, index: number) {
        const component = this.cfr.resolveComponentFactory(FeatureEditGraphqlComponent)
            .create(this.injector);
        component.instance.spec = this.feature.spec;
        component.instance.query = query;
        component.instance.saved.subscribe(q => {
            this.feature.graphql.splice(index, 1, q);
            this.manager.put(this.feature);
            this.modal.close();
        });
        component.instance.deleted.subscribe(() => {
            this.feature.graphql.splice(index, 1);
            this.manager.put(this.feature);
            this.modal.close();
        });
        this.modal.open(component, new ModalOptions({
            title: {text: 'Edit Graph QL', icon: LocalUI.icons.graphQl}
        }));
    }
}
