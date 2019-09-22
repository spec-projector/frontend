import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Authorization } from 'src/app/model/authorization';

const DEFAULT_MOCKS_DELAY = 500;
const DEFAULT_LANGUAGE = 'en';
const AUTHORIZATION_KEY = 'Authorization';

@Injectable({providedIn: 'root'})
export class AppConfig {

    language$ = new BehaviorSubject<string>(!!localStorage.language ? localStorage.language : DEFAULT_LANGUAGE);
    mocksPath = '/assets/mocks';

    localMode: boolean = (href => {
        // href = 'http://localhost';
        const regex = /(localhost|127.0.0.1)/ig;
        return regex.test(href);
    })(window.location.href);

    authorization$ = new BehaviorSubject<Authorization>((() => {
        if (!!localStorage[AUTHORIZATION_KEY]) {
            return JSON.parse(localStorage[AUTHORIZATION_KEY]) as Authorization;
        }

        return null;
    })());

    set authorization(authorization: Authorization) {
        if (!!authorization) {
            localStorage.setItem(AUTHORIZATION_KEY, JSON.stringify(authorization));
        } else {
            localStorage.removeItem(AUTHORIZATION_KEY);
        }

        this.authorization$.next(authorization);
    }

    get authorization() {
        return this.authorization$.getValue();
    }

    set language(language: string) {
        localStorage.setItem('language', language);
        this.language$.next(language);
    }

    get language() {
        return this.language$.getValue();
    }

    set useMocks(value: boolean) {
        localStorage.setItem('useMocks', value ? '1' : '');
    }

    get useMocks() {
        if (localStorage.useMocks !== undefined) {
            return localStorage.useMocks;
        }
        const href = window.location.href;
        return /use-mocks/i.test(href);
    }

    set mocksDelay(value: number) {
        localStorage.setItem('mocksDelay', `${value}`);
    }

    get mocksDelay() {
        if (localStorage.mocksDelay !== undefined) {
            return localStorage.mocksDelay;
        }
        return DEFAULT_MOCKS_DELAY;
    }

    set backendEndpoint(backendEndpoint: string) {
        if (!!backendEndpoint) {
            localStorage.setItem('backendEndpoint', backendEndpoint);
        } else {
            localStorage.removeItem('backendEndpoint');
        }
    }

    get backendEndpoint(): string {
        return 'https://specprojector.com/api';
    }

    constructor(@Inject(HttpClient) private http: HttpClient,
                @Inject(DOCUMENT) private document: Document) {
    }
}
