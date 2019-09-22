import { EventEmitter, Injectable } from '@angular/core';
import { Signal } from 'src/app/model/signal';

@Injectable()
export class SignalsService {

    signals$: EventEmitter<Signal> = new EventEmitter<Signal>();

    signal(signal: Signal) {
        this.signals$.emit(signal);
    }
}
