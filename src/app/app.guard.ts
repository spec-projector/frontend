import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AppConfig } from '../app-config';

@Injectable({providedIn: 'root'})
export class AuthorizationGuard implements CanActivate {

    constructor(private config: AppConfig,
                private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        if (!this.config.authorization) {
            this.router.navigate(['/login']);
        }
        return of(!!this.config.authorization);
    }
}
