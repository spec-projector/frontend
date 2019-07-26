import { Component, ComponentFactoryResolver, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService, UI } from 'junte-ui';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SpaceSyncComponent } from 'src/app/components/spec/sync/space-sync.component';
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

    private reader = new FileReader();
    spec: Spec;
    project: string;
    errors: ValidationError[] = [];
    mode = new FormControl(true);
    form = this.formBuilder.group({mode: this.mode});

    constructor(private formBuilder: FormBuilder,
                private route: ActivatedRoute,
                private cfr: ComponentFactoryResolver,
                private injector: Injector,
                private modalService: ModalService,
                private router: Router,
                public manager: SpecManager) {
    }

    ngOnInit() {
        this.route.data.subscribe(({spec}) => this.spec = spec);
        this.route.params.subscribe(({project}) => this.project = project);
        this.manager.mode = this.mode.value ? EditMode.edit : EditMode.view;
        this.mode.valueChanges.subscribe(mode => this.manager.mode = mode ? EditMode.edit : EditMode.view);
    }

    import(spec: Spec) {
        const component = this.cfr.resolveComponentFactory(SpaceSyncComponent).create(this.injector);
        this.modalService.open(component);
        this.manager.clear();
        this.manager.import(this.project, new Subject(), spec)
            .pipe(finalize(() => this.modalService.close()))
            .subscribe(spec => {
                this.spec = spec;
                this.router.navigate(['..', this.project], {relativeTo: this.route});
            });
    }

    load({target}: Event) {
        this.reader.onload = ({target}) => this.import(JSON.parse(target['result']));
        this.reader.readAsText(target['files'][0]);
    }

    export(element: any) {
        const file = new Blob([JSON.stringify(this.spec)], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = 'test.json';
        element.click();
    }
}
