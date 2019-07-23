import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { UI } from 'junte-ui';
import { filter, tap } from 'rxjs/operators';
import { SpecManager } from 'src/app/managers/spec.manager';
import { EditMode } from 'src/app/model/enums/edit-mode';
import { Epic } from 'src/app/model/spec/planning/epic';

@Component({
    selector: 'spec-epic',
    templateUrl: './epic.component.html',
    styleUrls: ['./epic.component.scss']
})
export class EpicComponent {

    ui = UI;
    editMode = EditMode;

    private _epic: Epic;

    mode = EditMode.view;

    title = new FormControl();
    form = this.formBuilder.group({
        title: this.title
    });

    @Input() set epic(epic: Epic) {
        this._epic = epic;
        this.updateForm();

        epic.changes.subscribe(() => this.updateForm());
    }

    get epic() {
        return this._epic;
    }

    constructor(public manager: SpecManager,
                private formBuilder: FormBuilder) {
        this.form.valueChanges
            .pipe(filter(() => !!this.epic),
                tap(() => Object.assign(this.epic, this.form.getRawValue())))
            .subscribe(() => this.manager.put(this.epic));
    }

    private updateForm() {
        this.form.patchValue({
            title: this.epic.title
        });
    }

}
