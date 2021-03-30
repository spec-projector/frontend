import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from 'src/app/login/login.component';
import { SocialLoginSystem } from '../../enums/signin';
import { NoneLoggedGuard } from '../guards/aurhorisation';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    canActivate: [NoneLoggedGuard]
  },
  {
    path: 'gitlab',
    data: {system: SocialLoginSystem.gitLab},
    component: LoginComponent
  },
  {
    path: 'google',
    data: {system: SocialLoginSystem.google},
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule {
}
