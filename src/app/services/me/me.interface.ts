import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Me } from 'src/app/models/me';

export interface IMeService {
    getMe(): Observable<Me>;

    heartbeat(): Observable<any>;
}

export let me_service = new InjectionToken('IMeService');
