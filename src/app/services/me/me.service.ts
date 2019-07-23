import { Injectable } from '@angular/core';
import { HttpService } from 'junte-angular';
import { Observable } from 'rxjs';
import { Me } from 'src/app/models/user';
import { IMeService } from 'src/app/services/me/me.interface';

@Injectable()
export class MeService implements IMeService {

    constructor(private http: HttpService) {
    }

    getMe(): Observable<Me> {
        return this.http.get<Me>('me/user');
    }

    heartbeat(): Observable<any> {
        return this.http.post<any>('me/heartbeat');
    }
}
