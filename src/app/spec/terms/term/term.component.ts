import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UI } from '@junte/ui';
import { SpecManager } from 'src/managers/spec.manager';
import { EditMode } from 'src/enums/edit-mode';
import { Term } from 'src/model/spec/planning/term';
import { Token } from 'src/model/spec/planning/token';
import { Spec } from 'src/model/spec/spec';

class TermMode {
    name: EditMode;
    description: EditMode;
}

@Component({
    selector: 'spec-term',
    templateUrl: './term.component.html',
    styleUrls: ['./term.component.scss']
})
export class TermComponent implements OnInit {

    private _term: Term;

    ui = UI;
    editMode = EditMode;

    mode: TermMode = {
        name: EditMode.view,
        description: EditMode.view
    };

    form = this.formBuilder.group({
        name: null,
        description: null
    });

    @Input() spec: Spec;

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

    @ViewChild('description', {static: false})
    set description(description: ElementRef<HTMLTextAreaElement>) {
        if (!!description) {
            this.adaptation(description.nativeElement);
        }
    }

    constructor(private formBuilder: FormBuilder,
                public manager: SpecManager) {
    }

    ngOnInit() {
        this.form.valueChanges.subscribe(value => {
            [this.term.name, this.term.description] = [value.name, Token.parse(value.description)];
            this.manager.put(this.term);
        });
    }

    delete() {
        const index = this.spec.terms.findIndex(term => term.id === this.term.id);
        this.spec.terms.splice(index, 1);
        this.manager.put(this.spec);
    }

    adaptation(element) {
        element.style.height = `${element.scrollHeight}px`;
    }
}
