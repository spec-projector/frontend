import { Component, ComponentFactoryResolver, EventEmitter, Injector, Input, Output } from '@angular/core';
import { ModalOptions, ModalService, PopoverService, UI } from 'junte-ui';
import { LocalUI } from '../../../../enums/local-ui';
import { Graphql } from '../../../../model/spec/planning/graphql';
import { Spec } from '../../../../model/spec/spec';
import { FeatureEditGraphqlComponent } from './edit-graphql/feature-edit-graphql.component';

@Component({
    selector: 'spec-api',
    templateUrl: './api.component.html',
    styleUrls: ['./api.component.scss']
})
export class ApiComponent {

    ui = UI;
    localUi = LocalUI;

    @Input()
    spec: Spec;

    @Input()
    graphql: Graphql[] = [];

    @Output()
    changed = new EventEmitter<{ graphql?: Graphql[] }>();

    constructor(private popover: PopoverService,
                private injector: Injector,
                private cfr: ComponentFactoryResolver,
                private modal: ModalService) {
    }

    addGraphQL() {
        const component = this.cfr.resolveComponentFactory(FeatureEditGraphqlComponent)
            .create(this.injector);
        component.instance.spec = this.spec;
        component.instance.saved.subscribe(q => {
            this.graphql.push(q);
            this.changed.emit({graphql: this.graphql});
        });
        this.modal.open(component, new ModalOptions({
            title: {text: 'Add Graph QL', icon: LocalUI.icons.graphQl}
        }));
    }

    editGraphQL(query: Graphql, index: number) {
        const component = this.cfr.resolveComponentFactory(FeatureEditGraphqlComponent)
            .create(this.injector);
        component.instance.spec = this.spec;
        component.instance.query = query;
        component.instance.saved.subscribe(q => {
            this.graphql.splice(index, 1, q);
            this.changed.emit({graphql: this.graphql});
            this.modal.close();
        });
        component.instance.deleted.subscribe(() => {
            this.graphql.splice(index, 1);
            this.changed.emit({graphql: this.graphql});
            this.modal.close();
        });
        this.modal.open(component, new ModalOptions({
            title: {text: 'Edit Graph QL', icon: LocalUI.icons.graphQl}
        }));
    }

}
