import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'mockArray'})
export class MockArrayPipe implements PipeTransform {
  transform(length: number): number[] {
    const arr = [];
    for (let i = 0; i < length; i++) {
      arr.push(i);
    }
    return arr;
  }
}

@Pipe({name: 'map'})
export class MapPipe implements PipeTransform {
  transform(arr: any[], field: string, version: number): any[] {
    return arr.map(e => e[field]);
  }
}
