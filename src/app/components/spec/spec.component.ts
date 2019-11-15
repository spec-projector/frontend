import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UI } from 'junte-ui';
import { SpecManager } from 'src/app/managers/spec.manager';
import { EditMode } from 'src/app/model/enums/edit-mode';
import { Spec } from 'src/app/model/spec/spec';
import { ValidationError } from 'src/app/model/validation/error';

@Component({
    selector: 'app-spec',
    templateUrl: './spec.component.html',
    styleUrls: ['./spec.component.scss']
})
export class SpecComponent implements OnInit {
    ui = UI;

    spec: Spec;
    errors: ValidationError[] = [];
    mode = new FormControl(true);
    form = this.formBuilder.group({mode: this.mode});

    constructor(private formBuilder: FormBuilder,
                private route: ActivatedRoute,
                public manager: SpecManager) {
    }

    ngOnInit() {
        this.route.data.subscribe(({spec}) => this.spec = spec);
        this.manager.mode = this.mode.value ? EditMode.edit : EditMode.view;
        this.mode.valueChanges.subscribe(mode => this.manager.mode = mode ? EditMode.edit : EditMode.view);
    }

    load({target}: Event) {
        // this.reader.onload = ({target}) => this.import(JSON.parse(target['result']));
        // this.reader.readAsText(target['files'][0]);
    }

    dump(element: HTMLAnchorElement) {
        this.manager.dump()
            .subscribe(dump => {
                const file = new Blob([JSON.stringify(dump, null, 4)],
                    {type: 'text/plain'});
                element.href = URL.createObjectURL(file);
                element.download = 'dump.json';
                element.click();
            });
    }
}
