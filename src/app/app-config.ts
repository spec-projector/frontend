import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthToken } from 'src/models/auth-token';
import { LOCAL_MODE } from '../consts';

const AUTH_TOKEN_KEY = 'auth_token';

@Injectable({providedIn: 'root'})
export class AppConfig {

  token$ = new BehaviorSubject<AuthToken>((() => {
    if (!!localStorage[AUTH_TOKEN_KEY]) {
      return JSON.parse(localStorage[AUTH_TOKEN_KEY]) as AuthToken;
    }

    return null;
  })());

  set token(token: AuthToken) {
    if (!!token) {
      localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(token));
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }

    this.token$.next(token);
  }

  get token() {
    return this.token$.getValue();
  }
}
