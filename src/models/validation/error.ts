import { Actor } from 'src/models/spec/planning/actor';
import { Epic } from 'src/models/spec/planning/epic';
import { Feature } from 'src/models/spec/planning/feature';
import { Sprint } from 'src/models/spec/planning/sprint';

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
