import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthorizationGuard} from 'src/app/app.guard';

const routes: Routes = [
    {
        path: 'login',
        loadChildren: './components/login/login.module#LoginModule'
    },
    {
        path: 'projects/:project',
        loadChildren: './components/spec/spec.module#SpecModule',
        canActivate: [AuthorizationGuard]
    },
    {
        path: 'projects',
        loadChildren: './components/projects/projects.module#ProjectsModule',
        canActivate: [AuthorizationGuard]
    },
    {
        path: 'import',
        loadChildren: './components/import/import.module#ImportModule',
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
