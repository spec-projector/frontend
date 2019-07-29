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
    created = new EventEmitter<string>();

    constructor(private formBuilder: FormBuilder) {
    }

    private create() {
        if (validate(this.form)) {
            this.created.emit(this.title.value);
        }
    }
}
