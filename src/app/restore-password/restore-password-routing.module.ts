import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RestorePasswordComponent } from './restore-password.component';

export const routes: Routes = [
    {
        path: '',
        component: RestorePasswordComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RestorePasswordRoutingModule {
}
