import { Injectable } from '@angular/core';
import { Me } from 'src/app/model/user';
import { HttpMockService } from 'src/app/services/http-mock.service';
import { IMeService } from './me.interface';
import { Observable, of } from 'rxjs';


@Injectable()
export class MeMockService implements IMeService {

  constructor(private http: HttpMockService) {
  }

  getMe(): Observable<Me> {
    return this.http.get('me/me.json');
  }

  heartbeat(): Observable<any> {
    return of(null);
  }
}
