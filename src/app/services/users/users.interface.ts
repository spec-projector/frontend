import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Authorization } from 'src/app/model/authorization';
import { LoginCredentials } from 'src/app/model/login-credentials';

export interface IUsersService {

    gitlab(code: string, state: string): Observable<Authorization>;

    login(credentials: LoginCredentials): Observable<Authorization>;

    logout(): Observable<any>;
}

export let users_service = new InjectionToken('users_service');
