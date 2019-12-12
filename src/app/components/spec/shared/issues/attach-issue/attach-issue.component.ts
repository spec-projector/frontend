import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UI } from 'junte-ui';
import { Issue } from 'src/app/model/spec/planning/issue';
import { Spec } from 'src/app/model/spec/spec';

@Component({
    selector: 'spec-attach-issue',
    templateUrl: './attach-issue.component.html',
    styleUrls: ['./attach-issue.component.scss']
})
export class AttachIssueComponent {

    ui = UI;

    @Input()
    spec: Spec;

    @Output()
    attached = new EventEmitter<Issue>();

    form = this.fb.group({
        resource: [null, [Validators.required]],
        url: [null, [Validators.required]]
    });

    constructor(private fb: FormBuilder) {
    }

    attach() {
        const {resource, url} = this.form.getRawValue();
        this.attached.emit(new Issue({resource, url}));
    }

}
