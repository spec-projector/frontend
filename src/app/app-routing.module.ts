import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizationGuard } from 'src/app/app.guard';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'import',
        pathMatch: 'full'
    },
    {
        path: 'space',
        loadChildren: './components/space/space.module#SpaceModule',
        canActivate: [AuthorizationGuard]
    },
    {
        path: 'import',
        loadChildren: './components/import/import.module#ImportModule',
        canActivate: [AuthorizationGuard]
    },
    {
        path: 'tests',
        loadChildren: './components/tests/tests.module#TestsModule'
    },
    {
        path: 'login',
        loadChildren: './components/login/login.module#LoginModule'
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
