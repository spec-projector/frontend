import { EventEmitter, Injectable } from '@angular/core';

export class MeUpdated {

}

export interface Signal {

}

@Injectable({providedIn: 'root'})
export class Signals {

    events = new EventEmitter<Signal>();

    dispatch(signal: Signal) {
        this.events.emit(signal);

    }

}
