import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { SpaceManager } from 'src/app/services/space-manager.service';
import { EditMode } from 'src/enums/edit-mode';
import { UI } from 'junte-ui';
import { Entity } from 'src/model/orm/entity';
import { EntityField } from 'src/model/orm/entity-field';
import { merge } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

@Component({
    selector: 'spec-entity',
    templateUrl: './entity.component.html',
    styleUrls: ['./entity.component.scss']
})
export class EntityComponent {

    ui = UI;
    editMode = EditMode;

    private _entity: Entity;

    title = new FormControl();
    name = new FormControl();
    autoName = new FormControl();

    mode = EditMode.view;

    form = this.formBuilder.group({
        title: this.title,
        name: this.name,
        autoName: this.autoName
    });

    @Input() set entity(entity: Entity) {
        this._entity = entity;
        this.updateForm();

        entity.changes.subscribe(() => this.updateForm());
    }

    get entity() {
        return this._entity;
    }

    constructor(public space: SpaceManager,
                private formBuilder: FormBuilder) {
        this.autoName.valueChanges.subscribe(() =>
            this.autoName.value ? this.name.disable() : this.name.enable());

        merge(this.title.valueChanges, this.autoName.valueChanges)
            .subscribe(() => this.updateName());

        this.form.valueChanges
            .pipe(filter(() => !!this.entity),
                tap(() => Object.assign(this.entity, this.form.getRawValue())))
            .subscribe(() => this.space.put(this.entity));
    }

    private updateForm() {
        this.form.patchValue({
            name: this.entity.name,
            title: this.entity.title,
            autoName: this.entity.autoName
        });
    }

    private updateName() {
        if (this.autoName.value) {
            let name = this.title.value.toLowerCase();
            name = name.replace(/\s+/g, '_');
            this.name.patchValue(name);
        }
    }

    addField() {
        const field = new EntityField({
            title: 'Field',
            name: 'field'
        });
        field.linking(this.entity);
        this.entity.fields.push(field);
        this.space.put(this.entity);
    }

    deleteField(index: number) {
        this.entity.fields.splice(index, 1);
        this.space.put(this.entity);
    }

    moveField(event: CdkDragDrop<EntityField[]>) {
        moveItemInArray(this.entity.fields, event.previousIndex, event.currentIndex);
        this.space.put(this.entity);
    }

    trackField(index: number) {
        return index;
    }

}
