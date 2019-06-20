import {Pipe, PipeTransform} from '@angular/core';
import {Feature} from '../../model/planning/feature';
import {Epic} from '../../model/planning/epic';

export class EpicGroup {
    constructor(public epic: Epic,
                public features: Feature[] = []) {

    }
}

@Pipe({name: 'groupFeatures'})
export class GroupFeaturesPipe implements PipeTransform {
    transform(features: Feature[]): EpicGroup[] {
        const groups = features.reduce((result: Map<Epic, EpicGroup>, feature) => {
            const key = feature.epic || null;
            let group = result.get(key);
            if (!group) {
                group = new EpicGroup(feature.epic);
                result.set(key, group);
            }
            group.features.push(feature);
            return result;
        }, new Map());

        const epics = Array.from(groups.keys()).map(epic => groups.get(epic));
        epics.sort((a, b) => !!a.epic > !!b.epic ? -1 : (!!a.epic < !!b.epic ? 1 : 0));
        return epics;
    }
}