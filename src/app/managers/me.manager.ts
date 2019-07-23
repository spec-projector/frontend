import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppConfig } from 'src/app-config';
import { Me } from 'src/app/models/user';
import { me_service } from 'src/app/services/me/me.interface';
import { MeService } from 'src/app/services/me/me.service';

@Injectable({providedIn: 'root'})
export class MeManager {

    user$: BehaviorSubject<Me> = new BehaviorSubject<Me>(null);

    set user(user: Me) {
        if (this.user !== user) {
            this.user$.next(user);
        }
    }

    get user(): Me {
        return this.user$.getValue();
    }

    constructor(@Inject(me_service) private meService: MeService,
                private config: AppConfig) {
        this.config.authorization$.subscribe(token => {
            if (!!token) {
                this.meService.getMe().subscribe(user => {
                    this.user = user;
                }, () => this.config.authorization = null);
            } else {
                this.user = null;
            }
        });
    }
}
