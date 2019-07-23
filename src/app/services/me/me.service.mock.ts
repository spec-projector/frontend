import { Injectable } from '@angular/core';
import { HttpMockService } from 'junte-angular';
import { Me } from 'src/app/models/user';
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
