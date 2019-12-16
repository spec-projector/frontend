import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UI } from 'junte-ui';
import { Feature } from 'src/app/model/spec/planning/feature';
import { Graphql } from 'src/app/model/spec/planning/graphql';
import { Spec } from 'src/app/model/spec/spec';

@Component({
    selector: 'spec-feature-edit-graphql',
    templateUrl: './feature-edit-graphql.component.html',
    styleUrls: ['./feature-edit-graphql.component.scss']
})
export class FeatureEditGraphqlComponent {

    ui = UI;

    spec: Spec;

    set query({title, text}: Graphql) {
        this.form.patchValue({title, text});
    }

    form = this.fb.group({
        title: [null, [Validators.required]],
        text: [null, [Validators.required]]
    });

    @Input() feature: Feature;

    @Output()
    saved = new EventEmitter<Graphql>();

    @Output()
    deleted = new EventEmitter<any>();

    constructor(private fb: FormBuilder) {
    }

    save() {
        const {title, text} = this.form.getRawValue();

        this.saved.emit(new Graphql({title, text}));
    }

}
