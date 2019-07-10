import { Actor } from 'model/planning/actor';
import { Epic } from 'model/planning/epic';
import { Feature } from 'model/planning/feature';
import { Sprint } from 'model/planning/sprint';

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
