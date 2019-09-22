import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { deserialize } from 'serialize-ts';
import { Authorization } from 'src/app/model/authorization';
import { LoginCredentials } from 'src/app/model/login-credentials';
import { HttpService } from 'src/app/services/http.service';
import { IUsersService } from 'src/app/services/users/users.interface';

@Injectable()
export class UsersService implements IUsersService {

    constructor(private http: HttpService) {
    }

    gitlab(code: string, state: string): Observable<Authorization> {
        return this.http.get<Authorization>('complete/gitlab',
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
