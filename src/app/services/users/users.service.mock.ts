import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { deserialize } from 'serialize-ts';
import { Authorization } from 'src/app/model/authorization';
import { LoginCredentials } from 'src/app/model/login-credentials';
import { IUsersService } from 'src/app/services/users/users.interface';

@Injectable({providedIn: 'root'})
export class UsersMockService implements IUsersService {

    gitlab(code: string, state: string): Observable<Authorization> {
        return of({type: 'mock', token: 'mock'})
            .pipe(map(src => deserialize(src, Authorization)), delay(500));
    }

    login(credentials: LoginCredentials): Observable<Authorization> {
        return of({type: 'mock', token: 'mock'})
            .pipe(map(src => deserialize(src, Authorization)), delay(500));
    }

    logout(): Observable<any> {
        return of(null);
    }
}
