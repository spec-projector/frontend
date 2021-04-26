import { Pipe, PipeTransform } from '@angular/core';
import { Spec } from 'src/models/spec/spec';
import {Feature} from '../../../models/spec/planning/feature';
import {Observable} from 'rxjs';
import {Term} from '../../../models/spec/planning/term';
import {Module} from '../../../models/spec/planning/module';
import {Actor} from '../../../models/spec/planning/actor';

@Pipe({name: 'features'})
export class FeaturesPipe implements PipeTransform {

    transform(spec: Spec): string[] {
        let features = [];
        spec.actors.forEach(actor => features = [...features, ...actor.features]);
        return features.map(feature => `feature-${feature.id}`);
    }

}

@Pipe({name: 'featurePrice', pure: false})
export class FeaturePricePipe implements PipeTransform {
  transform(feature: Feature): Observable<number> {
    return new Observable<number>(o => {
      const cost = feature.resources.reduce((price, r) => {
        const resource = feature.spec.resourceTypes.find(res => res.title === r.resource);
        return price + (!!resource ? resource.hourRate * r.hours : 0);
      }, 0);
      o.next(cost);
      o.complete();
    });
  }
}

@Pipe({name: 'featureTerms'})
export class FeatureTermsPipe implements PipeTransform {
  transform(feature: Feature): Term[] {
    return feature.getTerms();
  }
}

export class ModuleGroup {
  constructor(public module: Module,
              public features: Feature[] = []) {

  }
}

export class ActorGroup {
  constructor(public actor: Actor,
              public features: Feature[] = []) {

  }
}

@Pipe({name: 'groupFeaturesByModules'})
export class GroupFeaturesByModulesPipe implements PipeTransform {
  transform(features: Feature[], version?: number): ModuleGroup[] {
    const groups = features.reduce((result: Map<Module, ModuleGroup>, feature) => {
      const key = feature.module || null;
      let group = result.get(key);
      if (!group) {
        group = new ModuleGroup(feature.module);
        result.set(key, group);
      }
      group.features.push(feature);
      return result;
    }, new Map());

    const modules = Array.from(groups.keys()).map(epic => groups.get(epic));
    modules.sort((a, b) => !!a.module > !!b.module ? -1 : (!!a.module < !!b.module ? 1 : 0));
    for (const g of modules) {
      g.features.sort((a, b) => a.sort < b.sort ? -1 : (a.sort > b.sort ? 1 : 0));
    }
    return modules;
  }
}

@Pipe({name: 'groupFeaturesByActor'})
export class GroupFeaturesByActorPipe implements PipeTransform {
  transform(features: Feature[], version?: number): ActorGroup[] {
    const groups = features.reduce((result: Map<Actor, ActorGroup>, feature) => {
      const key = feature.actor || null;
      let group = result.get(key);
      if (!group) {
        group = new ActorGroup(feature.actor);
        result.set(key, group);
      }
      group.features.push(feature);
      return result;
    }, new Map());

    const actors = Array.from(groups.keys()).map(actor => groups.get(actor));
    actors.sort((a, b) => !!a.actor > !!b.actor ? -1 : (!!a.actor < !!b.actor ? 1 : 0));
    return actors;
  }
}
