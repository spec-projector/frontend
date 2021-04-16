import { EventEmitter, Injectable } from '@angular/core';

export interface Signal {
  sender: Object;
}

export class MeUpdated implements Signal {
  sender: Object;
}

@Injectable({providedIn: 'root'})
export class SignalsService {

  events = new EventEmitter<Signal>();

  dispatch(signal: Signal) {
    this.events.emit(signal);

  }

}
