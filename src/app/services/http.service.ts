import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AppConfig } from 'src/app/app-config';
import { ApplicationError, FatalError, ForbiddenError, InvalidGrantError, NetworkError, NotFoundError } from 'src/app/model/errors';
import { isBoolean, isNumber, isString } from 'util';

const CONTENT_TYPE_HEADER = 'Content-Type';
const ACCEPT_LANGUAGE_HEADER = 'Accept-Language';
const ACCEPT_HEADER = 'Accept';
const AUTHORIZATION_HEADER = 'Authorization';
const JSON_MIME_TYPE = 'application/json';

@Injectable()
export class HttpService {

    requests$ = new BehaviorSubject<number>(0);
    error$ = new EventEmitter<Error>();

    private set requests(requests: number) {
        this.requests$.next(requests);
    }

    private get requests() {
        return this.requests$.getValue();
    }

    constructor(private http: HttpClient,
                private config: AppConfig) {
    }

    get<T>(path: string, search: HttpParams = null): Observable<T> {

        const options = {params: search};
        this.prepareOptions(options);

        return Observable.create((observer: Observable<T>) => {
            this.requests++;
            this.http.get(this.getRequestUrl(path), options)
                .pipe(finalize(() => this.requests--))
                .subscribe(resp => this.processResponse<T>(observer, resp),
                    err => this.processError(observer, err));
        }) as Observable<T>;
    }

    post<T>(path: string, data: any = null, options = {headers: {}}): Observable<T> {
        this.prepareOptions(options);

        let body;
        if (isBoolean(data) || isNumber(data) || isString(data)) {
            body = data.toString();
        } else {
            body = JSON.stringify(data);
            options.headers[CONTENT_TYPE_HEADER] = JSON_MIME_TYPE;
        }

        return Observable.create((observer: Observable<T>) => {
            this.requests++;
            this.http.post(this.getRequestUrl(path), body, options)
                .pipe(finalize(() => this.requests--))
                .subscribe(resp => this.processResponse<T>(observer, resp),
                    err => this.processError(observer, err));
        }) as Observable<T>;
    }

    delete<T>(path: string): Observable<T> {
        const options = {};
        this.prepareOptions(options);

        return Observable.create((observer: Observable<T>) => {
            this.requests++;
            this.http.delete(this.getRequestUrl(path), options)
                .pipe(finalize(() => this.requests--))
                .subscribe(resp => this.processResponse<T>(observer, resp),
                    err => this.processError(observer, err));
        }) as Observable<T>;
    }

    put<T>(path: string, data: any): Observable<T> {
        const options = {headers: {}};
        this.prepareOptions(options);
        options.headers[CONTENT_TYPE_HEADER] = JSON_MIME_TYPE;

        return Observable.create((observer: Observable<T>) => {
            this.requests++;
            this.http.put(this.getRequestUrl(path), JSON.stringify(data), options)
                .pipe(finalize(() => this.requests--))
                .subscribe(resp => this.processResponse<T>(observer, resp),
                    err => this.processError(observer, err));
        }) as Observable<T>;
    }

    patch<T>(path: string, data: any): Observable<T> {
        const options = {headers: {}};
        this.prepareOptions(options);
        options.headers[CONTENT_TYPE_HEADER] = JSON_MIME_TYPE;

        return Observable.create((observer: Observable<T>) => {
            this.requests++;
            this.http.patch(this.getRequestUrl(path), JSON.stringify(data), options)
                .pipe(finalize(() => this.requests--))
                .subscribe(resp => this.processResponse<T>(observer, resp),
                    err => this.processError(observer, err));
        }) as Observable<T>;
    }

    private prepareOptions(options: any) {
        if (!options.headers) {
            options.headers = {};
        }

        options.headers[ACCEPT_LANGUAGE_HEADER] = this.config.language;
        options.headers[ACCEPT_HEADER] = JSON_MIME_TYPE;
        if (!!this.config.authorization) {
            options.headers[AUTHORIZATION_HEADER] = `${this.config.authorization.type} ${this.config.authorization.token}`;
        }
        options.withCredentials = true;
    }

    private getRequestUrl(path: string): string {
        return [this.config.backendEndpoint, path].join('/');
    }

    private processResponse<T>(observer, resp) {
        try {
            observer.next(resp as T);
            observer.complete();
        } catch (e) {
            observer.next(resp ? resp.body : null);
            observer.complete();
        }
    }

    private processError(observer, err) {
        let error;
        switch (err.status) {
            case 502:
            case 0:
                error = new NetworkError();
                break;
            case 500:
                error = new FatalError();
                break;
            case 403:
                error = ForbiddenError.create(err.error);
                break;
            case 404:
                error = NotFoundError.create(err.error);
                break;
            case 401:
                error = InvalidGrantError.create(err.error);
                break;
            default:
                try {
                    error = ApplicationError.create(err.error);
                } catch (e) {
                    error = ApplicationError.create(err.statusText);
                }
        }

        observer.error(error);
        this.error$.emit(error);
    }

}
