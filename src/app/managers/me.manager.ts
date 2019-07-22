import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AppConfig } from 'src/app-config';
import { Me } from 'src/app/models/me';
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
                private config: AppConfig,
                private router: Router) {
        this.config.authorization$.subscribe(token => {
            if (!!token) {
                this.meService.getMe().subscribe(user => {
                    this.user = user;
                    this.router.navigate(['/']).then(() => null);
                }, () => this.config.authorization = null);
            } else {
                this.user = null;
                this.router.navigate(['/login']).then(() => null);
            }
        });
    }
}
