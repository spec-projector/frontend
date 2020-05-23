import { ComponentFactoryResolver, Injectable, Injector } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { ModalOptions, ModalService, UI } from 'junte-ui';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { deserialize } from 'serialize-ts/dist';
import { SpaceSyncComponent } from 'src/app/components/spec/shared/sync/space-sync.component';
import { ProjectGQL } from 'src/app/components/spec/spec.graphql';
import { SpecManager } from 'src/app/managers/spec.manager';
import { Project } from 'src/app/model/projects';
import { Spec } from 'src/app/model/spec/spec';
import { Actor } from '../../model/spec/planning/actor';
import { Feature } from '../../model/spec/planning/feature';

@Injectable({providedIn: 'root'})
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

@Injectable({providedIn: 'root'})
export class ProjectResolver implements Resolve<Observable<Project>> {

  constructor(private projectGQL: ProjectGQL) {
  }

  resolve(route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot): Observable<Project> {
    return this.projectGQL.fetch({id: route.params['project']})
      .pipe(map(({data: {project}}) => deserialize(project, Project)));
  }
}

@Injectable({providedIn: 'root'})
export class ActorResolver implements Resolve<Actor> {

  constructor() {
  }

  resolve(route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot): Actor {
    const {spec} = route.parent.data as { spec: Spec };
    const {actor} = route.params as { actor: string };

    return spec.actors.find(a => a.id === actor);
  }
}

@Injectable({providedIn: 'root'})
export class ActorFeatureResolver implements Resolve<Feature> {

  constructor() {
  }

  resolve(route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot): Feature {
    const {actor} = route.parent.data as { actor: Actor };
    const {feature} = route.params as { feature: string };

    return actor.features.find(f => f.id === feature);
  }
}

@Injectable({providedIn: 'root'})
export class FeatureGraphqlResolver implements Resolve<number> {

  constructor() {
  }

  resolve(route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot): number {
    const {index} = route.params as { index: string };

    return +index;
  }
}
