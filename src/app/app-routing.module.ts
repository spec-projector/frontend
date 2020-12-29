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
        loadChildren: () => import('./login/login.module')
            .then(m => m.LoginModule)
    },
    {
        path: 'projects',
        loadChildren: () => import('./layout/layout.module')
            .then(m => m.LayoutModule),
        canActivate: [AuthorizationGuard]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        paramsInheritanceStrategy: 'always',
        relativeLinkResolution: 'corrected',
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled',
        scrollOffset: [0, 150]
    })],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
