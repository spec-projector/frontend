import {MonoTypeOperatorFunction, Observable, Operator, Subscriber, TeardownLogic} from "rxjs";
import {Persistence, SerializeType} from "../../decorators/persistence";
import {FormGroup} from "@angular/forms";

function getSnapshot(persistence: Persistence): Object {
    return persistence.serialize(SerializeType.reference);
}

export function hasUpdates(persistence: Persistence, form: FormGroup): boolean {
    const before = getSnapshot(persistence);
    Object.assign(persistence, form.getRawValue());
    const after = getSnapshot(persistence);
    return JSON.stringify(before) !== JSON.stringify(after);
}


// https://github.com/ReactiveX/rxjs/blob/master/src/internal/operators/distinctUntilChanged.ts

interface Changes {
    before: Object;
    after: Object;
}

export function untilChanged(persistence: Persistence, form: FormGroup): MonoTypeOperatorFunction<Changes> {
    return (source: Observable<Changes>) => source.lift(new UntilChangedOperator(persistence, form));
}

class UntilChangedOperator implements Operator<Changes, Changes> {

    constructor(private persistence: Persistence, private form: FormGroup) {

    }

    call(subscriber: Subscriber<Changes>, source: any): TeardownLogic {
        return source.subscribe(new DistinctUntilChangedSubscriber(this.persistence, this.form, subscriber));
    }
}

class DistinctUntilChangedSubscriber extends Subscriber<Changes> {
    constructor(private persistence: Persistence, private form: FormGroup,
                destination: Subscriber<Changes>) {
        super(destination);
    }

    protected _next(): void {
        const before = this.getSnapshot();
        Object.assign(this.persistence, this.form.getRawValue());
        const after = this.getSnapshot();
        if (JSON.stringify(before) !== JSON.stringify(after)) {
            this.destination.next({before: before, after: after});
        }
    }

    private getSnapshot(): Object {
        return this.persistence.serialize(SerializeType.reference);
    }
}
