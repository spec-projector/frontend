import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from 'src/app/layout/layout.component';
import { MeUserResolver } from '../../resolvers/me';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    resolve: {
      me: MeUserResolver
    },
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
        path: 'subscription',
        resolve: {
          me: MeUserResolver
        },
        loadChildren: () => import('../subscription/subscription.module')
          .then(m => m.SubscriptionModule)
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
