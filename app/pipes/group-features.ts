import {Pipe, PipeTransform} from '@angular/core';
import {Feature} from '../../model/planning/feature';
import {Epic} from '../../model/planning/epic';
import {Actor} from "../../model/planning/actor";

export class EpicGroup {
    constructor(public epic: Epic,
                public features: Feature[] = []) {

    }
}

export class ActorGroup {
    constructor(public actor: Actor,
                public features: Feature[] = []) {

    }
}

@Pipe({name: 'groupFeaturesByEpic'})
export class GroupFeaturesByEpicPipe implements PipeTransform {
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

@Pipe({name: 'groupFeaturesByActor'})
export class GroupFeaturesByActorPipe implements PipeTransform {
    transform(features: Feature[]): ActorGroup[] {
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
