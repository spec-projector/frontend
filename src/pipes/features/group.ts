import { Pipe, PipeTransform } from '@angular/core';
import { Actor } from 'src/models/spec/planning/actor';
import { Module } from 'src/models/spec/planning/module';
import { Feature } from 'src/models/spec/planning/feature';

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
