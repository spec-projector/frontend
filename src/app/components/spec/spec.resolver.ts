import { ComponentFactoryResolver, Injectable, Injector } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { ModalOptions, ModalService } from 'junte-ui';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SpaceSyncComponent } from 'src/app/components/spec/sync/space-sync.component';
import { SpecManager } from 'src/app/managers/spec.manager';
import { Spec } from 'src/app/model/spec/spec';

@Injectable()
export class SpecResolver implements Resolve<Spec> {

    constructor(private manager: SpecManager,
                private cfr: ComponentFactoryResolver,
                private injector: Injector,
                private modalService: ModalService) {
    }

    resolve(route: ActivatedRouteSnapshot,
            state: RouterStateSnapshot): Observable<Spec> {
        const project = `project_${route.params['project']}`;
        const component = this.cfr.resolveComponentFactory(SpaceSyncComponent).create(this.injector);
        this.modalService.open(component, null, new ModalOptions({
            title: 'Syncing specification'
        }));
        console.log('spec resolver');
        return this.manager.get(project).pipe(finalize(() => this.modalService.close()));
    }
}
