import { Pipe, PipeTransform } from '@angular/core';
import { Actor } from 'src/app/model/spec/planning/actor';

@Pipe({name: 'actorPrice'})
export class ActorPricePipe implements PipeTransform {
    transform(actor: Actor): number {
        return actor.features.reduce((total, feature) => {
            return total + feature.resources.reduce((price, r) => {
                const resource = feature.spec.resourceTypes
                    .find(res => res.title === r.resource);
                return price + (!!resource ? resource.hourRate * r.hours : 0);
            }, 0);
        }, 0);
    }
}
