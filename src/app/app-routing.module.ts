import { NgModule } from '@angular/core';
import { PreloadingStrategy, Route, RouterModule, Routes } from '@angular/router';
import { Observable, of } from 'rxjs';
import { delay, mergeMap } from 'rxjs/operators';

const PRELOADING_DELAY = 5000;

export class DelayedModulePreloading implements PreloadingStrategy {
  preloadedModules: string[] = [];

  preload(route: Route, load: () => Observable<boolean>): Observable<boolean> {
    if (route.data && route.data['preload']) {
      // console.log(`preload module ${route.path}`);
      this.preloadedModules.push(route.path);
      return of(true).pipe(
        delay(PRELOADING_DELAY),
        mergeMap(() => load()));
    } else {
      return of(null);
    }
  }
}

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    data: {animation: 'lp'},
    loadChildren: () => import('./lp/lp.module')
      .then(m => m.LpModule)
  },
  {
    path: 'login',
    data: {animation: 'login'},
    loadChildren: () => import('./login/login.module')
      .then(m => m.LoginModule)
  },
  {
    path: 'oauth',
    loadChildren: () => import('./login/login.module')
      .then(m => m.LoginModule)
  },
  {
    path: 'register',
    data: {animation: 'register'},
    loadChildren: () => import('./register/register.module')
      .then(m => m.RegisterModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./reset-password/reset-password.module')
      .then(m => m.ResetPasswordModule)
  },
  {
    path: '',
    loadChildren: () => import('./layout/layout.module')
      .then(m => m.LayoutModule)
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: DelayedModulePreloading,
      paramsInheritanceStrategy: 'always',
      relativeLinkResolution: 'corrected',
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      scrollOffset: [0, 70],
      initialNavigation: 'enabled'
    })],
  providers: [
    DelayedModulePreloading
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {

}
