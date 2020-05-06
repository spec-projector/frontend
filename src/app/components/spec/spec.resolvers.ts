import { ComponentFactoryResolver, Injectable, Injector } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { ModalOptions, ModalService, UI } from 'junte-ui';
import { Observable, of } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { deserialize } from 'serialize-ts/dist';
import { SpaceSyncComponent } from 'src/app/components/spec/shared/sync/space-sync.component';
import { ProjectGQL } from 'src/app/components/spec/spec.graphql';
import { SpecManager } from 'src/app/managers/spec.manager';
import { Project } from 'src/app/model/projects';
import { Spec } from 'src/app/model/spec/spec';
import { Feature } from '../../model/spec/planning/feature';

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
    this.modalService.open(component, new ModalOptions({
      title: {text: 'Syncing project', icon: UI.icons.runningMan}
    }));
    console.log('spec resolver');
    return this.manager.get(project)
      .pipe(finalize(() => this.modalService.close()));
  }
}

@Injectable()
export class ProjectResolver implements Resolve<Observable<Project>> {

  constructor(private projectGQL: ProjectGQL) {
  }

  resolve(route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot): Observable<Project> {
    return this.projectGQL.fetch({id: route.params['project']})
      .pipe(map(({data: {project}}) => deserialize(project, Project)));
  }
}

@Injectable()
export class ActorFeatureResolver implements Resolve<Observable<Feature>> {

  constructor() {
  }

  resolve(route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot): Observable<Feature> {
    const {spec} = route.parent.data as { spec: Spec };
    const {actor, feature} = route.params;

    return of(spec.actors.find(a => a.id === actor)
      .features.find(f => f.id === feature));
  }
}
