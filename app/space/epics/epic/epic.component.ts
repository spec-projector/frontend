import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { SpaceManager } from 'app/services/space-manager.service';
import { EditMode } from 'enums/edit-mode';
import { UI } from 'junte-ui';
import { Epic } from 'model/planning/epic';
import { filter, tap } from 'rxjs/operators';

@Component({
    selector: 'app-epic',
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

    constructor(public manager: SpaceManager,
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
