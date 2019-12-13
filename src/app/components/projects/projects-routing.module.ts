import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsComponent } from 'src/app/components/projects/projects.component';

const routes: Routes = [
    {
        path: '',
        component: ProjectsComponent
    },
    {
        path: ':project',
        loadChildren: () => import('./../spec/spec.module')
            .then(m => m.SpecModule)
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProjectsRoutingModule {
}
