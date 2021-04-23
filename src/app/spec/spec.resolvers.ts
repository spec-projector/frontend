import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { deserialize } from 'serialize-ts';
import { ProjectGQL } from 'src/app/spec/spec.graphql';
import { SpecManager } from 'src/managers/spec.manager';
import { Project } from 'src/models/projects';
import { Spec } from 'src/models/spec/spec';
import { Entity } from '../../models/spec/orm/entity';
import { Enum } from '../../models/spec/orm/enum';
import { Actor } from '../../models/spec/planning/actor';
import { Feature } from '../../models/spec/planning/feature';
import { Graphql } from '../../models/spec/planning/graphql';
import { SchemeInvalidError } from '../../types/errors';

@Injectable({providedIn: 'root'})
export class SpecResolver implements Resolve<Spec> {

  constructor(private projectGQL: ProjectGQL,
              private manager: SpecManager,
              private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot): Observable<Spec> {
    const {project} = route.params;
    return new Observable(o => {
      this.projectGQL.fetch({id: project})
        .pipe(map(({data: {project: p}}) => deserialize(p, Project)))
        .subscribe(p => {
          console.log(p.dbName);
          console.log('spec resolver');
          this.manager.get(p.dbName)
            .pipe(finalize(() => o.complete()))
            .subscribe(s => o.next(s), err => {
              if (err instanceof SchemeInvalidError) {
                this.router.navigate(['projects', project, 'updating'])
                  .then(() => null);
              } else {
                o.error(err);
              }
            });
        });
    });
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

  resolve(route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot): Actor {
    const {spec} = route.parent.data as { spec: Spec };
    const {actor} = route.params as { actor: string };

    return spec.actors.find(a => a.id === actor);
  }
}

@Injectable({providedIn: 'root'})
export class ActorFeatureResolver implements Resolve<Feature> {

  resolve(route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot): Feature {
    const {actor} = route.parent.data as { actor: Actor };
    const {feature} = route.params as { feature: string };

    return actor.features.find(f => f.id === feature);
  }
}

@Injectable({providedIn: 'root'})
export class FeatureGraphqlResolver implements Resolve<Graphql> {

  resolve(route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot): Graphql {
    const {feature} = route.parent.data as { feature?: Feature };

    const {id} = route.params as { id: string };
    if (/^[\d+]$/.test(id)) {
      return feature.graphql[+id];
    }
    return feature.graphql.find(g => g.id === id);
  }
}

@Injectable({providedIn: 'root'})
export class EntityResolver implements Resolve<Entity> {

  resolve(route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot): Entity {
    const {spec} = route.parent.data as { spec: Spec };
    const {entity} = route.params as { entity: string };

    return spec.model.entities.find(a => a.id === entity);
  }
}

@Injectable({providedIn: 'root'})
export class EnumResolver implements Resolve<Enum> {

  resolve(route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot): Enum {
    const {spec} = route.parent.data as { spec: Spec };
    const {enum: enum_} = route.params as { enum: string };

    return spec.model.enums.find(a => a.id === enum_);
  }
}
