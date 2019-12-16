import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UI } from 'junte-ui';
import { SpecManager } from 'src/app/managers/spec.manager';
import { EditMode } from 'src/app/model/enums/edit-mode';
import { Term } from 'src/app/model/spec/planning/term';
import { TextToken } from 'src/app/model/spec/planning/token';
import { Spec } from 'src/app/model/spec/spec';
import * as uuid from 'uuid/v1';

class AlphabeticalTerms {
    char: string;
    terms: Term[] = [];

    constructor(term: Term) {
        this.char = term.name[0];
        this.terms.push(term);
    }
}

@Component({
    selector: 'spec-terms',
    templateUrl: './terms.component.html',
    styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {

    ui = UI;
    editMode = EditMode;
    terms: AlphabeticalTerms[] = [];

    mode = EditMode.view;
    spec: Spec;

    constructor(public manager: SpecManager,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.data.subscribe(({spec}) => {
            this.spec = spec;
            const terms = spec.terms.sort((a, b) => a.name.localeCompare(b.name));
            terms.forEach(term => {
                const last = this.terms[this.terms.length - 1];

                if (!!this.terms.length && !!last && last.char === term.name[0]) {
                    last.terms.push(term);
                } else {
                    this.terms.push(new AlphabeticalTerms(term));
                }
            });
        });
    }

    addTerm() {
        const term = new Term({
            id: uuid(),
            name: 'Some term',
            description: [new TextToken('description...')]
        });
        this.spec.terms.unshift(term);

        this.manager.put(term);
        this.manager.put(this.spec);
    }

}
