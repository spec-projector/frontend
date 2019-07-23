import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Config } from 'junte-angular';

@Injectable({providedIn: 'root'})
export class AppConfig extends Config {

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
        super();
    }
}
