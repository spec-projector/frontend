import { Actor } from 'src/model/planning/actor';
import { Epic } from 'src/model/planning/epic';
import { Feature } from 'src/model/planning/feature';
import { Sprint } from 'src/model/planning/sprint';

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
