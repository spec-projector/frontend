import {Component, Input} from '@angular/core';
import {UI} from 'junte-ui';
import {FormBuilder, FormControl} from '@angular/forms';
import {SpaceManager} from '../../services/space-manager.service';
import {filter, tap} from 'rxjs/operators';
import {EditMode} from '../../../enums/edit-mode';
import {Actor} from '../../../model/planning/actor';
import {DndDropEvent} from "ngx-drag-drop";
import {Feature} from "../../../model/planning/feature";
import {Epic} from "../../../model/planning/epic";

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
