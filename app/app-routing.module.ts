import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'import',
        pathMatch: 'full'
    },
    {
        path: 'space',
        loadChildren: './space/space.module#SpaceModule'
    },
    {
        path: 'import',
        loadChildren: './import/import.module#ImportModule'
    },
    {
        path: 'tests',
        loadChildren: './tests/tests.module#TestsModule'
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
