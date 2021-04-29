import {Pipe, PipeTransform} from '@angular/core';
import {Entity} from 'src/models/spec/orm/entity';
import {Module} from 'src/models/spec/planning/module';
import { Enum } from '../../../../models/spec/orm/enum';
import { Feature } from '../../../../models/spec/planning/feature/feature';

export class ModuleGroup {
  module: Module;
  enums: Enum[] = [];

  constructor(module: Module) {
    this.module = module;
  }
}

@Pipe({name: 'groupEnumsByModules'})
export class GroupEnumsByModulesPipe implements PipeTransform {
  transform(enums: Enum[], version?: number): ModuleGroup[] {
    const groups = enums.reduce((result: Map<Module, ModuleGroup>, enum_) => {
      const key = enum_.module || null;
      let group = result.get(key);
      if (!group) {
        group = new ModuleGroup(enum_.module);
        result.set(key, group);
      }
      group.enums.push(enum_);
      return result;
    }, new Map());

    const modules = Array.from(groups.keys()).map(epic => groups.get(epic));
    modules.sort((a, b) => !!a.module > !!b.module ? -1 : (!!a.module < !!b.module ? 1 : 0));
    for (const g of modules) {
      g.enums.sort((a, b) => a.sort < b.sort ? -1 : (a.sort > b.sort ? 1 : 0));
    }
    return modules;
  }
}

@Pipe({name: 'enumsWithoutModule'})
export class EnumsWithoutModulePipe implements PipeTransform {
  transform(enums: Enum[], version: number): Enum[] {
    const filtered = enums.filter(f => !f.module);
    return filtered.length > 0 ? filtered : null;
  }
}
