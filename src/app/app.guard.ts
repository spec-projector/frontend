import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { SpecManager } from 'src/app/managers/spec.manager';
import { AppConfig } from './app-config';

@Injectable({providedIn: 'root'})
export class AuthorizationGuard implements CanActivate {

    constructor(private config: AppConfig,
                private router: Router,
                private manager: SpecManager) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        if (!this.config.authorization) {
            this.router.navigate(['/login']);
        } else {
            this.manager.clear();
        }
        return of(!!this.config.authorization);
    }
}
