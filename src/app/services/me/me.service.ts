import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Me } from 'src/app/model/user';
import { HttpService } from 'src/app/services/http.service';
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
