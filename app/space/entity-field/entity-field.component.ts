import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Entity} from '../../../model/orm/entity';
import {UI} from 'junte-ui';
import {FormBuilder, FormControl} from '@angular/forms';
import {EntityField, FieldType} from '../../../model/orm/entity-field';
import {merge} from "rxjs";
import {filter, tap} from "rxjs/operators";
import {EditMode} from "../../../enums/edit-mode";

@Component({
    selector: 'app-entity-field',
    templateUrl: './entity-field.component.html',
    styleUrls: ['./entity-field.component.scss']
})
export class EntityFieldComponent {

    private _field: EntityField;

    ui = UI;
    fieldType = FieldType;
    editMode = EditMode;

    title = new FormControl();
    name = new FormControl();
    autoName = new FormControl();
    typeControl = new FormControl();

    form = this.formBuilder.group({
        name: this.name,
        title: this.title,
        autoName: this.autoName,
        type: this.typeControl,
        reference: null
    });

    mode = EditMode.view;

    @Input() set field(field: EntityField) {
        this._field = field;
        this.form.patchValue({
            name: field.name,
            title: field.title,
            autoName: field.autoName,
            type: field.type,
            reference: field.reference
        });
    }

    get field() {
        return this._field;
    }

    @Output() changed = new EventEmitter<EntityField>();

    constructor(private formBuilder: FormBuilder) {
        this.autoName.valueChanges.subscribe(() =>
            this.autoName.value ? this.name.disable() : this.name.enable());

        merge(this.title.valueChanges, this.autoName.valueChanges)
            .subscribe(() => this.updateName());

        this.form.valueChanges
            .pipe(filter(() => !!this.field),
                tap(() => Object.assign(this.field, this.form.getRawValue())))
            .subscribe(() => {
                this.field.linking();
                this.changed.emit(this.field);
            });
    }

    private updateName() {
        if (this.autoName.value) {
            let title = this.title.value.toLowerCase();
            title = title.replace(/\s+/g, '_');
            this.name.patchValue(title);
        }
    }

}
