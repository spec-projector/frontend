import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BlockComponent, UI } from 'junte-ui';
import { finalize } from 'rxjs/operators';
import { SpecManager } from 'src/app/managers/spec.manager';
import { EditMode } from 'src/app/model/enums/edit-mode';
import { ResourceType, Spec } from 'src/app/model/spec/spec';

@Component({
    selector: 'spec-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

    _spec: Spec;

    ui = UI;
    editMode = EditMode;
    progress = {restore: false};

    @ViewChild('block', {static: false})
    block: BlockComponent;

    set spec(spec: Spec) {
        this._spec = spec;

        this.form.patchValue({
            description: spec.description,
            author: spec.author,
            gitLabKey: spec.integration.gitLabKey,
            gitHubKey: spec.integration.gitHubKey,
            graphqlPlaygroundUrl: spec.integration.graphqlPlaygroundUrl
        });

        spec.resourceTypes.forEach(({title, hourRate}) => {
            const g = this.resourceTypesGroup();
            g.patchValue({title, hourRate});
            this.resourceTypes.push(g);
        });
    }

    get spec() {
        return this._spec;
    }

    resourceTypes = this.fb.array([]);

    form = this.fb.group({
        description: [null],
        author: [null],
        gitLabKey: [],
        gitHubKey: [],
        graphqlPlaygroundUrl: [],
        resourceTypes: this.resourceTypes
    });

    resourceTypesGroup = () => this.fb.group({
        title: [null, [Validators.required]],
        hourRate: [null, [Validators.required]]
    });

    constructor(private fb: FormBuilder,
                public manager: SpecManager,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.data.subscribe(({spec}) => this.spec = spec);
    }

    addResource() {
        this.resourceTypes.push(this.resourceTypesGroup());
    }

    deleteResourceType(index: number) {
        this.resourceTypes.removeAt(index);
    }

    save() {
        const {
            description,
            author,
            gitLabKey,
            gitHubKey,
            graphqlPlaygroundUrl,
            resourceTypes
        } = this.form.getRawValue();

        [this.spec.description,
            this.spec.author,
            this.spec.integration.gitLabKey,
            this.spec.integration.gitHubKey,
            this.spec.integration.graphqlPlaygroundUrl,
            this.spec.resourceTypes]
            = [description,
            author,
            gitLabKey,
            gitHubKey,
            graphqlPlaygroundUrl,
            resourceTypes.map(({title, hourRate}) =>
                new ResourceType({title, hourRate: +hourRate}))];

        this.manager.put(this.spec);

        this.block.success();

    }

    dump(element: HTMLAnchorElement) {
        this.manager.dump()
            .subscribe(dump => {
                const file = new Blob([JSON.stringify(dump, null, 4)],
                    {type: 'text/plain'});
                element.href = URL.createObjectURL(file);
                element.download = 'dump.json';
                element.click();
            });
    }

    restore({target: {files: [file]}}) {
        this.progress.restore = true;
        const reader = new FileReader();
        reader.onload = () => {
            const docs = JSON.parse(reader.result.toString());
            this.manager.restore(docs)
                .pipe(finalize(() => this.progress.restore = false))
                .subscribe(() => document.location.reload());
        };
        reader.readAsText(file);
    }

}
