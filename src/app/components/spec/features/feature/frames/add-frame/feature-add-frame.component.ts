import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UI } from '@junte/ui';
import { generate as shortid } from 'shortid';
import { Frame } from 'src/app/model/spec/planning/frame';

@Component({
    selector: 'spec-feature-add-frame',
    templateUrl: './feature-add-frame.component.html',
    styleUrls: ['./feature-add-frame.component.scss']
})
export class FeatureAddFrameComponent {

    ui = UI;

    form = this.fb.group({
        url: [null, [Validators.required]]
    });

    @Output()
    added = new EventEmitter<Frame>();

    constructor(private fb: FormBuilder) {
    }

    // https://www.figma.com/file/awyH7tq7nZlZATd56otvOzWY/Team-projector?node-id=3519%3A2
    add() {
        const {url} = this.form.getRawValue();
        const parsed = new URL(url);
        const {groups: {file}} = /file\/(?<file>[0-9a-zA-Z]+)\//i.exec(parsed.pathname);
        const node = parsed.searchParams.get('node-id');

        this.added.emit(new Frame({id: shortid(), file, node}));
    }

}
