import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UI } from '@junte/ui';
import { Language } from 'src/enums/language';
import { Spec } from 'src/model/spec/spec';
import { ValidationError } from 'src/model/validation/error';

@Component({
    selector: 'spec-validate',
    templateUrl: './validate.component.html',
    styleUrls: ['./validate.component.scss']
})
export class ValidateComponent implements OnInit {

    ui = UI;
    language = Language;

    spec: Spec;
    errors: ValidationError[] = [];

    constructor(private route: ActivatedRoute,
                @Inject(LOCALE_ID) public locale: string) {
    }

    ngOnInit() {
        this.route.data.subscribe(({spec}) => {
            this.errors = spec.validate();
            this.spec = spec;
        });
    }

}
