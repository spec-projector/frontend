import { Pipe, PipeTransform } from '@angular/core';
import { Entity } from 'src/models/spec/orm/entity';
import { Module } from 'src/models/spec/planning/module';
import { Enum } from '../../../../models/spec/orm/enum';

export class ModuleGroup {
  module: Module;
  entities: Entity[] = [];

  constructor(module: Module) {
    this.module = module;
  }
}

@Pipe({name: 'groupEntitiesByModules'})
export class GroupEntitiesByModulesPipe implements PipeTransform {
  transform(entities: Entity[], version?: number): ModuleGroup[] {
    const groups = entities.reduce((result: Map<Module, ModuleGroup>, entity) => {
      const key = entity.module || null;
      let group = result.get(key);
      if (!group) {
        group = new ModuleGroup(entity.module);
        result.set(key, group);
      }
      group.entities.push(entity);
      return result;
    }, new Map());

    const modules = Array.from(groups.keys()).map(epic => groups.get(epic));
    modules.sort((a, b) => !!a.module > !!b.module ? -1 : (!!a.module < !!b.module ? 1 : 0));
    for (const g of modules) {
      g.entities.sort((a, b) => a.sort < b.sort ? -1 : (a.sort > b.sort ? 1 : 0));
    }
    return modules;
  }
}

@Pipe({name: 'entitiesWithoutModule'})
export class EntitiesWithoutModulePipe implements PipeTransform {
  transform(entities: Entity[], version: number): Entity[] {
    const filtered = entities.filter(f => !f.module);
    return filtered.length > 0 ? filtered : null;
  }
}
