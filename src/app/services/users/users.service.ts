import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Authorization, HttpService } from 'junte-angular';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { deserialize } from 'serialize-ts';
import { LoginCredentials } from 'src/app/models/login-credentials';
import { IUsersService } from 'src/app/services/users/users.interface';

@Injectable()
export class UsersService implements IUsersService {

    constructor(private http: HttpService) {
    }

    gitlab(code: string, state: string): Observable<Authorization> {
        return this.http.get<Authorization>('gitlab/login',
            new HttpParams({fromObject: {code: code, state: state}}))
            .pipe(map(obj => deserialize(obj, Authorization)));
    }

    login(credentials: LoginCredentials): Observable<Authorization> {
        return this.http.post<Authorization>('login', credentials)
            .pipe(map(obj => deserialize(obj, Authorization)));
    }

    logout(): Observable<any> {
        return this.http.post<Authorization>('logout');
    }
}
