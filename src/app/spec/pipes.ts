import { Pipe, PipeTransform } from '@angular/core';
import { Spec } from 'src/models/spec/spec';

@Pipe({name: 'specPrice'})
export class SpecPricePipe implements PipeTransform {
    transform(spec: Spec, version: number): number {
        return spec.actors.reduce((t1, actor) => {
            return t1 + actor.features.reduce((t2, feature) => {
                return t2 + feature.resources.reduce((t3, r) => {
                    const resource = feature.spec.resourceTypes
                        .find(res => res.title === r.resource);
                    return t3 + (!!resource ? resource.hourRate * r.hours : 0);
                }, 0);
            }, 0);
        }, 0);
    }
}
