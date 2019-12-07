import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UI } from 'junte-ui';
import { Feature, Resource } from 'src/app/model/spec/planning/feature';
import { ResourceType } from 'src/app/model/spec/spec';

@Component({
    selector: 'spec-resources',
    templateUrl: './resources.component.html',
    styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent {

    ui = UI;

    _feature: Feature;

    resources = this.fb.array([]);

    form = this.fb.group({
        resources: this.resources
    });

    @Input()
    set feature(feature: Feature) {
        this._feature = feature;
        feature.resources.forEach(({resource, hours}) => {
            const g = this.resourcesGroup();
            g.patchValue({resource, hours});
            this.resources.push(g);
        });
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
        this.form.valueChanges.subscribe(({resources}) =>
            this.changed.emit(resources.map(({resource, hours}) =>
                new ResourceType({resource, hours: +hours}))));
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
