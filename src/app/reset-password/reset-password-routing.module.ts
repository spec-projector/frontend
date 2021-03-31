import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoneLoggedGuard } from '../../guards/aurhorisation';
import { ResetPasswordComponent } from './reset-password.component';
import { SendCodeComponent } from './send-code/send-code.component';
import { SetPasswordComponent } from './set-password/set-password.component';

export const routes: Routes = [
  {
    path: '',
    component: ResetPasswordComponent,
    canActivate: [NoneLoggedGuard],
    children: [
      {
        path: '',
        component: SendCodeComponent
      },
      {
        path: 'set-password',
        component: SetPasswordComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResetPasswordRoutingModule {

}
