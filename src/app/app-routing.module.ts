import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    data: {animation: 'lp'},
    loadChildren: () => import('./lp/lp.module')
      .then(m => m.LPModule)
  },
  {
    path: 'projects',
    loadChildren: () => import('./layout/layout.module')
      .then(m => m.LayoutModule)
  },
  {
    path: 'login',
    data: {animation: 'login'},
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
    path: 'restore-password',
    loadChildren: () => import('./restore-password/restore-password.module')
      .then(m => m.RestorePasswordModule)
  },
  {
    path: '**',
    data: {animation: 'lp'},
    loadChildren: () => import('./lp/lp.module')
      .then(m => m.LPModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      paramsInheritanceStrategy: 'always',
      relativeLinkResolution: 'corrected',
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
      scrollOffset: [0, 150],
      initialNavigation: 'enabled'
    })],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
