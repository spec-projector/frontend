import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { delay, finalize } from 'rxjs/operators';
import { AppConfig } from 'src/app/app-config';

@Injectable()
export class HttpMockService {

    requests$: BehaviorSubject<number> = new BehaviorSubject(0);

    private set requests(requests: number) {
        this.requests$.next(requests);
    }

    private get requests() {
        return this.requests$.getValue();
    }

    constructor(private http: HttpClient,
                private config: AppConfig) {
    }

    get<T>(path: string): Observable<T> {
        return Observable.create(observer => {
            this.requests++;
            this.http.get([this.config.mocksPath, path].join('/'))
                .pipe(delay(this.config.mocksDelay),
                    finalize(() => {
                        this.requests--;
                        observer.complete();
                    }))
                .subscribe(resp => observer.next(resp));
        });
    }

}
