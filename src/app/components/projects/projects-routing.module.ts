import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizationGuard } from 'src/app/app.guard';
import { ProjectsComponent } from 'src/app/components/projects/projects.component';

export const routes: Routes = [
    {
        path: '',
        component: ProjectsComponent
    },
    {
        path: ':project',
        loadChildren: () => import('../spec/spec.module').then(m => m.SpecModule),
        canActivate: [AuthorizationGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProjectsRoutingModule {
}
