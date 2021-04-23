import { Actor } from 'src/models/spec/planning/actor';
import { Module } from 'src/models/spec/planning/module';
import { Feature } from 'src/models/spec/planning/feature';
import { Sprint } from 'src/models/spec/planning/sprint';

export enum ErrorType {
    termMissed
}

export class ValidationError {
    actor: Actor;
    epic: Module;
    feature: Feature;
    sprint: Sprint;
}

export class TermMissedError extends ValidationError {
    type = ErrorType.termMissed;
    term: string;
}
