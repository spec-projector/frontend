import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UI } from 'junte-ui';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Feature, Resource } from 'src/app/model/spec/planning/feature';
import { ResourceType } from 'src/app/model/spec/spec';
import { config } from 'src/environments/environment';

@Component({
    selector: 'spec-resources',
    templateUrl: './resources.component.html',
    styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent {

    ui = UI;

    private _feature: Feature;
    private subscriptions: { form: Subscription } = {form: null};

    resources = this.fb.array([]);
    form = this.fb.group({
        resources: this.resources
    });

    @Input()
    set feature(feature: Feature) {
        if (!!this.subscriptions.form) {
            this.subscriptions.form.unsubscribe();
        }

        this._feature = feature;
        feature.resources.forEach(({resource, hours}) => {
            const g = this.resourcesGroup();
            g.patchValue({resource, hours});
            this.resources.push(g);
        });

        this.subscriptions.form = this.form.valueChanges
            .pipe(debounceTime(config.uiDebounceTime))
            .subscribe(({resources}) =>
                this.changed.emit(resources.map(({resource, hours}) =>
                    new ResourceType({resource, hours: +hours}))));
    }

    get feature() {
        return this._feature;
    }

    @Output()
    changed = new EventEmitter<Resource[]>();

    resourcesGroup = () => this.fb.group({
        resource: [null, [Validators.required]],
        hours: [null, [Validators.required]]
    });

    constructor(private fb: FormBuilder) {
    }

    fillResources() {
        for (const r of this.feature.spec.resourceTypes) {
            const group = this.resourcesGroup();
            group.patchValue({resource: r.title});
            this.resources.push(group);
        }
    }

    addResource() {
        this.resources.push(this.resourcesGroup());
    }

    deleteResource(index: number) {
        this.resources.removeAt(index);
    }

}
