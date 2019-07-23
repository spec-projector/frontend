import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SpaceManager } from 'src/app/services/space-manager.service';
import { EditMode } from 'src/enums/edit-mode';
import { UI } from 'junte-ui';
import { Term } from 'src/model/planning/term';
import { Token } from 'src/model/planning/token';

@Component({
    selector: 'spec-term',
    templateUrl: './term.component.html',
    styleUrls: ['./term.component.scss']
})
export class TermComponent implements OnInit {

    private _term: Term;

    @ViewChild('description', {static: false})
    description: ElementRef<HTMLTextAreaElement>;

    ui = UI;
    editMode = EditMode;

    mode = EditMode.view;

    form = this.formBuilder.group({
        name: null,
        description: null
    });

    @Input() set term(term: Term) {
        this._term = term;
        this.form.patchValue({
            name: term.name,
            description: term.description.map(t => t.toString()).join(' ')
        });
    }

    get term() {
        return this._term;
    }

    edit() {
        this.mode = EditMode.edit;
    }

    normal() {
        this.mode = EditMode.view;
    }

    constructor(private space: SpaceManager,
                private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.form.valueChanges.subscribe(value => {
            this.term.description = Token.parse(value.description);
            this.space.put(this.term);
        });
    }
}
