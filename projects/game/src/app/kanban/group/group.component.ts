import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { UI } from 'junte-ui';
import { KanbanManager } from 'projects/game/src/app/kanban/kanban.manager';
import { Group } from 'projects/game/src/models/group';
import { Issue } from 'projects/game/src/models/issue';
import { Kanban } from 'projects/game/src/models/kanban';
import { EditMode } from 'src/app/model/enums/edit-mode';
import * as uuid from 'uuid/v1';

@Component({
    selector: 'app-group',
    templateUrl: './group.component.html',
    styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {

    private _group: Group;
    ui = UI;
    editMode = EditMode;
    mode: EditMode = EditMode.view;
    title = new FormControl();
    form = this.formBuilder.group({title: this.title});

    @Input() kanban: Kanban;
    @Input() ids: string[];

    get group() {
        return this._group;
    }

    @Input() set group(group: Group) {
        this._group = group;
        this.title.patchValue(this.group.title);
    }

    @Output() kanbanChange = new EventEmitter<Kanban>();
    @Output() deleted = new EventEmitter<any>();
    @Output() edited = new EventEmitter<Group>();

    constructor(private kanbanManager: KanbanManager,
                private formBuilder: FormBuilder) {
    }

    ngOnInit(): void {
        this.title.valueChanges.subscribe(value => {
            this.group.title = value;
            this.edited.emit(this.group);
        });
    }

    drop(event: CdkDragDrop<Issue[]>) {
        const current = this.kanban.groups.find(group => group.id === event.container.id);
        const prev = this.kanban.groups.find(group => group.id === event.previousContainer.id);

        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data, event.container.data,
                event.previousIndex, event.currentIndex);
            this.kanbanManager.put(prev);
        }
        this.kanbanManager.put(current);
        this.kanbanManager.put(this.kanban);
        this.kanbanChange.emit(this.kanban);
    }

    addIssue() {
        const issue = new Issue({title: 'New Issue', id: uuid()});
        issue.linking(this.group);
        this.group.issues.push(issue);
        this.kanbanManager.put(issue);
        this.kanbanManager.put(this.group);
        this.kanbanManager.put(this.kanban);
        this.kanbanChange.emit(this.kanban);
    }

    deleteIssue(index: number) {
        this.group.issues.splice(index, 1);
        this.kanbanManager.put(this.group);
        this.kanbanManager.put(this.kanban);
        this.kanbanChange.emit(this.kanban);
    }

}
