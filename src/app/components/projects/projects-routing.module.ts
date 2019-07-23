import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectDetailComponent } from 'src/app/components/projects/project-detail/project-detail.component';
import { ProjectsComponent } from 'src/app/components/projects/projects.component';
import { ProjectResolver } from 'src/app/components/projects/projects.resolver';

export const routes: Routes = [
    {
        path: '',
        component: ProjectsComponent
    },
    {
        path: ':project_id',
        component: ProjectDetailComponent,
        resolve: {project: ProjectResolver}
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProjectsRoutingModule {
}
