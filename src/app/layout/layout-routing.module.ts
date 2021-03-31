import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from 'src/app/layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'projects',
        loadChildren: () => import('../projects/projects.module')
          .then(m => m.ProjectsModule)
      },
      {
        path: 'projects/:project',
        loadChildren: () => import('../spec/spec.module')
          .then(m => m.SpecModule)
      },
      {
        path: '',
        loadChildren: () => import('../site/site.module')
          .then(m => m.SiteModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule {

}
