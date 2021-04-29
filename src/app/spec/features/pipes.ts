import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { Actor } from '../../../models/spec/planning/actor';
import { Feature } from '../../../models/spec/planning/feature/feature';
import { Module } from '../../../models/spec/planning/module';
import { Sprint } from '../../../models/spec/planning/sprint';
import { Term } from '../../../models/spec/planning/term';

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

export class ActorGroup {
  constructor(public actor: Actor,
              public features: Feature[] = []) {

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

export class SprintGroup {
  constructor(public sprint: Sprint,
              public features: Feature[] = []) {

  }
}

@Pipe({name: 'featuresWithoutModule'})
export class FeaturesWithoutModulePipe implements PipeTransform {
  transform(features: Feature[], version: number): Feature[] {
    const filtered = features.filter(f => !f.module);
    return filtered.length > 0 ? filtered : null;
  }
}

@Pipe({name: 'featuresWithoutSprint'})
export class FeaturesWithoutSprintPipe implements PipeTransform {
  transform(features: Feature[], version: number): Feature[] {
    const filtered = features.filter(f => !f.sprint);
    return filtered.length > 0 ? filtered : null;
  }
}
