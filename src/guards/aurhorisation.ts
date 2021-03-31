import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AppConfig } from '../app/app-config';

@Injectable({providedIn: 'root'})
export class NoneLoggedGuard implements CanActivate {

  constructor(public config: AppConfig,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return of(!!this.config.authorization ? this.router.createUrlTree(['/projects']) : true);
  }

}

@Injectable({providedIn: 'root'})
export class LoggedGuard implements CanActivate {

  constructor(public config: AppConfig,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return of(!this.config.authorization ? this.router.createUrlTree(['/login']) : true);
  }

}
