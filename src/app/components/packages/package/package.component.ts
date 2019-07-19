import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { SpaceManager } from 'src/app/services/space-manager.service';
import { EditMode } from 'src/enums/edit-mode';
import { UI } from 'junte-ui';
import { Entity } from 'src/model/orm/entity';
import { Package } from 'src/model/orm/package';
import { merge } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { isUndefined } from 'util';
import * as uuid from 'uuid/v1';

@Component({
    selector: 'app-package',
    templateUrl: './package.component.html',
    styleUrls: ['./package.component.scss']
})
export class PackageComponent {

    ui = UI;
    editMode = EditMode;

    private _package: Package;


    mode = EditMode.view;

    title = new FormControl();
    name = new FormControl();
    autoName = new FormControl();

    form = this.formBuilder.group({
        title: this.title,
        name: this.name,
        autoName: this.autoName
    });

    @Input() set package(pack: Package) {
        this._package = pack;
        this.updateForm();

        pack.changes.subscribe(() => this.updateForm());
    }

    get package() {
        return this._package;
    }

    constructor(public space: SpaceManager,
                private formBuilder: FormBuilder) {
        this.autoName.valueChanges.subscribe(() =>
            this.autoName.value ? this.name.disable() : this.name.enable());

        merge(this.title.valueChanges, this.autoName.valueChanges)
            .subscribe(() => this.updateName());

        this.form.valueChanges
            .pipe(filter(() => !!this.package),
                tap(() => Object.assign(this.package, this.form.getRawValue())))
            .subscribe(() => this.space.put(this.package));
    }

    private updateForm() {
        this.form.patchValue({
            name: this.package.name,
            title: this.package.title,
            autoName: this.package.autoName
        });
    }

    private updateName() {
        if (this.autoName.value) {
            let name = this.title.value.toLowerCase();
            name = name.replace(/\s+/g, '_');
            this.name.patchValue(name);
        }
    }

    addEntity() {
        const entity = new Entity({
            id: uuid(),
            name: 'entity',
            title: 'Entity'
        });
        this.package.entities.push(entity);

        this.space.put(entity);
        this.space.put(this.package);
    }

    deleteEntity(index: number) {
        const entity = this.package.entities[index];
        this.package.entities.splice(index, 1);
        this.space.remove(entity);
        this.space.put(this.package);
    }

    moveEntity(event: any) {
        const index1 = isUndefined(event.index) ? this.package.entities.length - 1 : event.index;
        const index2 = event.data;
        const e1 = this.package.entities[index1];
        const e2 = this.package.entities[index2];
        this.package.entities.splice(index1, 1, e2);
        this.package.entities.splice(index2, 1, e1);
        this.space.put(this.package);
    }

}
