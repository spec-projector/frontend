import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizationGuard } from 'src/app/app.guard';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'projects',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadChildren: () => import('./components/login/login.module')
            .then(m => m.LoginModule)
    },
    {
        path: 'projects',
        loadChildren: () => import('./components/dashboard/dashboard.module')
            .then(m => m.DashboardModule),
        canActivate: [AuthorizationGuard]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        paramsInheritanceStrategy: 'always',
        relativeLinkResolution: 'corrected',
        scrollPositionRestoration: 'disabled',
        anchorScrolling: 'enabled',
        scrollOffset: [0, 150]
    })],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
