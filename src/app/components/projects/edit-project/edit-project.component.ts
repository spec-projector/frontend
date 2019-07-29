import { Component, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { validate } from 'junte-angular';
import { UI } from 'junte-ui';

@Component({
    selector: 'spec-edit-project',
    templateUrl: './edit-project.component.html',
    styleUrls: ['./edit-project.component.scss']
})
export class EditProjectComponent {

    ui = UI;
    title = new FormControl(null, Validators.required);
    form = this.formBuilder.group({title: this.title});
    saved = new EventEmitter<string>();

    constructor(private formBuilder: FormBuilder) {
    }

    private save() {
        if (validate(this.form)) {
            this.saved.emit(this.title.value);
        }
    }
}
