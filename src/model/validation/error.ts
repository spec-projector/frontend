import { Actor } from 'src/model/spec/planning/actor';
import { Epic } from 'src/model/spec/planning/epic';
import { Feature } from 'src/model/spec/planning/feature';
import { Sprint } from 'src/model/spec/planning/sprint';

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
