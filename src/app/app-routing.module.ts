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
        loadChildren: () => import('./components/projects/projects.module')
            .then(m => m.ProjectsModule),
        data: {breadcrumb: 'Projects'},
        canActivate: [AuthorizationGuard]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        paramsInheritanceStrategy: 'always',
        relativeLinkResolution: 'corrected'
    })],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
