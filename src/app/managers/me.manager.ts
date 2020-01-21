import { Inject, Injectable } from '@angular/core';
import { isEqual } from 'junte-ui';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { deserialize } from 'serialize-ts/dist';
import { AppConfig } from 'src/app/app-config';
import { MeManagerGQL } from 'src/app/managers/me-manager.graphql';
import { Me } from 'src/app/model/user';

@Injectable({providedIn: 'root'})
export class MeManager {

    user$: BehaviorSubject<Me> = new BehaviorSubject<Me>(null);

    set user(user: Me) {
        if (!isEqual(this.user, user)) {
            this.user$.next(user);
        }
    }

    get user(): Me {
        return this.user$.getValue();
    }

    constructor(@Inject(AppConfig) private config: AppConfig,
                private meManagerGQL: MeManagerGQL) {
        this.config.authorization$.subscribe(token => {
            if (!!token) {
                this.meManagerGQL.fetch()
                    .pipe(map(({data: {me}}) => deserialize(me, Me)))
                    .subscribe(user => this.user = user);
            } else {
                this.user = null;
            }
        });
    }
}
