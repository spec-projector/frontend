import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { UI } from '@junte/ui';
import { Issue } from 'projects/game/src/models/issue';
import { Kanban } from 'projects/game/src/models/kanban';
import { EditMode } from 'src/app/model/enums/edit-mode';

@Component({
    selector: 'app-issue',
    templateUrl: './issue.component.html',
    styleUrls: ['./issue.component.scss']
})
export class IssueComponent implements OnInit {

    private _issue: Issue;
    ui = UI;
    editMode = EditMode;
    mode: EditMode = EditMode.view;
    title = new FormControl();
    form = this.formBuilder.group({title: this.title});

    @Input() kanban: Kanban;
    @Input() ids: string[];

    get issue() {
        return this._issue;
    }

    @Input() set issue(issue: Issue) {
        this._issue = issue;
        this.title.patchValue(this.issue.title);
    }

    @Output() deleted = new EventEmitter();
    @Output() edited = new EventEmitter<Issue>();

    constructor(private formBuilder: FormBuilder) {
    }

    ngOnInit(): void {
        this.title.valueChanges.subscribe(value => {
            this.issue.title = value;
            this.edited.emit(this.issue);
        });
    }
}
