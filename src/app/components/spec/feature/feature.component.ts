import { Component, ComponentFactoryResolver, Injector, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ModalOptions, ModalService, PopoverService, UI } from 'junte-ui';
import { ClipboardService } from 'ngx-clipboard';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { FeatureEditGraphqlComponent } from 'src/app/components/spec/feature/edit-graphql/feature-edit-graphql.component';
import { FeatureMarkdownComponent } from 'src/app/components/spec/feature/markdown/feature-markdown.component';
import { LocalUI } from 'src/app/enums/local-ui';
import { SpecManager } from 'src/app/managers/spec.manager';
import { EditMode } from 'src/app/model/enums/edit-mode';
import { Feature, Resource, StoryEntry } from 'src/app/model/spec/planning/feature';
import { Frame } from 'src/app/model/spec/planning/frame';
import { Graphql } from 'src/app/model/spec/planning/graphql';
import { Issue } from 'src/app/model/spec/planning/issue';
import { Token } from 'src/app/model/spec/planning/token';

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
    opened = false;
    markdown = false;

    title = new FormControl();
    form = this.fb.group({
        title: this.title
    });

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

    constructor(public manager: SpecManager,
                private clipboard: ClipboardService,
                private fb: FormBuilder,
                private popover: PopoverService,
                private injector: Injector,
                private cfr: ComponentFactoryResolver,
                private modal: ModalService,
                private logger: NGXLogger) {
    }

    private updateForm() {
        this.form.patchValue({
            title: this.feature.title.map(t => t.toString()).join(' ')
        });
    }

    copyMarkdown() {
        const summary = this.summary.getMarkdown();
        this.markdown = true;
        this.clipboard.copyFromContent(summary.innerText);
        setTimeout(() => this.markdown = false, 5000);
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
