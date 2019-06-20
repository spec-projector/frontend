import { Actor } from '../model/planning/actor';
import { Feature } from '../model/planning/feature';
import { Epic } from '../model/planning/epic';
import { Sprint } from '../model/planning/sprint';

export enum ErrorType {
    termMissed
}

export class ValidationError {
    actor: Actor;
    epic: Epic;
    feature: Feature;
    sprint: Sprint;
}

export class TermMissedError extends ValidationError {
    type = ErrorType.termMissed;
    term: string;
}