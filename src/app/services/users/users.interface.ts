import { InjectionToken } from '@angular/core';
import { Authorization } from 'junte-angular';
import { Observable } from 'rxjs';
import { LoginCredentials } from 'src/app/models/login-credentials';

export interface IUsersService {

    gitlab(code: string, state: string): Observable<Authorization>;

    login(credentials: LoginCredentials): Observable<Authorization>;

    logout(): Observable<any>;
}

export let users_service = new InjectionToken('users_service');
