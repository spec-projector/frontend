import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {UI} from 'junte-ui';
import {EditMode} from '../../../types/edit-mode';
import {Term} from '../../../model/planning/term';
import {FormBuilder} from '@angular/forms';
import {Token} from '../../../model/planning/token';
import {SpaceService} from '../../services/space.service';

@Component({
    selector: 'app-term',
    templateUrl: './term.component.html',
    styleUrls: ['./term.component.scss']
})
export class TermComponent implements OnInit {

    private _term: Term;

    @ViewChild('description')
    description: ElementRef<HTMLTextAreaElement>;

    ui = UI;
    editMode = EditMode;

    mode = EditMode.normal;

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
        this.mode = EditMode.normal;
    }

    constructor(private space: SpaceService,
                private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.form.valueChanges.subscribe(value => {
            this.term.description = Token.parse(value.description);
            this.space.put(this.term);
        });
    }
}
