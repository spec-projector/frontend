import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UI } from 'junte-ui';
import { Spec } from 'src/app/model/spec/spec';
import { ValidationError } from 'src/app/model/validation/error';

@Component({
    selector: 'spec-validate',
    templateUrl: './validate.component.html',
    styleUrls: ['./validate.component.scss']
})
export class ValidateComponent implements OnInit {

    ui = UI;

    spec: Spec;
    errors: ValidationError[] = [];

    constructor(private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.data.subscribe(({spec}) => {
            this.errors = spec.validate();
            this.spec = spec;
        });
    }

}
