import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { UI, validate } from 'junte-ui';

@Component({
    selector: 'spec-edit-project',
    templateUrl: './edit-project.component.html',
    styleUrls: ['./edit-project.component.scss']
})
export class EditProjectComponent {

    ui = UI;
    titleControl = new FormControl(null, Validators.required);
    form = this.formBuilder.group({title: this.titleControl});

    @Input() set title(title: string) {
        this.titleControl.patchValue(title);
    }

    @Output() saved = new EventEmitter<string>();

    constructor(private formBuilder: FormBuilder) {
    }

    save() {
        if (validate(this.form)) {
            this.saved.emit(this.titleControl.value);
        }
    }
}
