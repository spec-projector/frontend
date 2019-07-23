import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { SpaceManager } from 'src/app/services/space-manager.service';
import { EditMode } from 'src/enums/edit-mode';
import { UI } from 'junte-ui';
import { Actor } from 'src/model/planning/actor';
import { Feature } from 'src/model/planning/feature';
import { TextToken } from 'src/model/planning/token';
import { filter, tap } from 'rxjs/operators';
import * as uuid from 'uuid/v1';

@Component({
    selector: 'spec-actor',
    templateUrl: './actor.component.html',
    styleUrls: ['./actor.component.scss']
})
export class ActorComponent {

    ui = UI;
    editMode = EditMode;

    private _actor: Actor;

    version = 0;
    mode = EditMode.view;

    name = new FormControl();
    form = this.formBuilder.group({
        name: this.name
    });

    @Input() set actor(actor: Actor) {
        this._actor = actor;
        this.updateForm();

        actor.changes.subscribe(() => this.updateForm());
    }

    get actor() {
        return this._actor;
    }

    constructor(public manager: SpaceManager,
                private formBuilder: FormBuilder) {
        this.form.valueChanges
            .pipe(filter(() => !!this.actor),
                tap(() => Object.assign(this.actor, this.form.getRawValue())))
            .subscribe(() => this.manager.put(this.actor));
    }

    private updateForm() {
        this.form.patchValue({
            name: this.actor.name
        });
    }

    onDropEpic(feature: Feature, {item: {data: {id}}}: CdkDragDrop<{ id: string }[]>) {
        const epic = this.actor.space.epics.find(e => e.id === id);
        if (!!feature.epic) {
            const index = feature.epic.features.indexOf(feature);
            feature.epic.features.splice(index, 1);
            this.manager.put(feature.epic);
        }

        epic.features.push(feature);
        feature.linking({epic: epic});
        this.manager.put(epic);

        this.version++;
    }

    trackFeature(index: number, feature: Feature) {
        return !!feature ? feature.id : null;
    }

    addFeature() {
        const feature = new Feature({
            id: uuid(),
            title: [new TextToken('Great feature')]
        });
        this.actor.features.push(feature);

        this.manager.put(feature);
        this.manager.put(this.actor);

        this.version++;
    }

    deleteFeature(id: string) {
        const index = this.actor.features.findIndex(f => f.id === id);
        const feature = this.actor.features[index];
        this.actor.features.splice(index, 1);
        this.manager.remove(feature);
        this.manager.put(this.actor);

        this.version++;
    }
}
