import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActorsComponent } from 'src/app/components/spec/actors/actors.component';
import { DetailsComponent } from 'src/app/components/spec/details/details.component';
import { EpicsComponent } from 'src/app/components/spec/epics/epics.component';
import { PackagesComponent } from 'src/app/components/spec/packages/packages.component';
import { SpecComponent } from 'src/app/components/spec/spec.component';
import {
  ActorFeatureResolver,
  ActorResolver, FeatureGraphqlResolver,
  ProjectResolver,
  SpecResolver
} from 'src/app/components/spec/spec.resolvers';
import { SprintComponent } from 'src/app/components/spec/sprints/sprint/sprint.component';
import { SprintsComponent } from 'src/app/components/spec/sprints/sprints.component';
import { SprintResolver } from 'src/app/components/spec/sprints/sprints.resolver';
import { TermsComponent } from 'src/app/components/spec/terms/terms.component';
import { ValidateComponent } from 'src/app/components/spec/validate/validate.component';
import { ActorEditComponent } from './actor/edit/actor-edit.component';
import { FeatureEditGraphqlComponent } from './feature/api/edit-graphql/feature-edit-graphql.component';
import { FeatureApiComponent } from './feature/api/feature-api.component';
import { FeatureEditComponent } from './feature/edit/edit.component';
import { FeatureFramesComponent } from './feature/frames/feature-frames.component';
import { FeatureIssuesComponent } from './feature/issues/feature-issues.component';
import { FeatureMarkdownComponent } from './feature/markdown/feature-markdown.component';
import { FeatureResourcesComponent } from './feature/resources/feature-resources.component';
import { FeatureStoryComponent } from './feature/story/feature-story.component';
import { FeaturesComponent } from './features/features.component';
import { PrintComponent } from './print/print.component';

export function getProject({project}) {
  return project.title;
}

export function getActor({actor}) {
  return actor.name;
}

export function getSprint({sprint}) {
  return sprint.title;
}

export function getFeature({feature}) {
  return feature.title;
}

export const routes: Routes = [
  {
    path: '',
    component: SpecComponent,
    resolve: {
      spec: SpecResolver,
      project: ProjectResolver
    },
    data: {breadcrumb: getProject},
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'details'
      },
      {
        path: 'details',
        component: DetailsComponent,
        data: {breadcrumb: 'General'}
      },
      {
        path: 'print',
        component: PrintComponent,
        data: {breadcrumb: 'Print'}
      },
      {
        path: 'sprints',
        data: {breadcrumb: 'Sprints'},
        children: [
          {
            path: '',
            component: SprintsComponent,
            resolve: {spec: SpecResolver},
            children: [{
              path: ':sprint',
              component: SprintComponent,
              data: {breadcrumb: getSprint},
              resolve: {sprint: SprintResolver}
            }],
            runGuardsAndResolvers: 'always'
          }
        ]
      },
      {
        path: 'epics',
        component: EpicsComponent,
        data: {breadcrumb: 'Epics'},
        resolve: {spec: SpecResolver}

      },
      {
        path: 'actors',
        component: FeaturesComponent,
        data: {breadcrumb: 'Actors'},
        children: [
          {
            path: '',
            component: ActorsComponent,
            resolve: {spec: SpecResolver},
            pathMatch: 'full'
          },
          {
            path: ':actor',
            component: ActorEditComponent,
            resolve: {actor: ActorResolver},
            data: {breadcrumb: getActor},
            children: [
              {
                path: 'features/:feature',
                component: FeatureEditComponent,
                data: {breadcrumb: getFeature},
                resolve: {feature: ActorFeatureResolver},
                children: [
                  {
                    path: '',
                    pathMatch: 'full',
                    redirectTo: 'story'
                  },
                  {
                    path: 'story',
                    component: FeatureStoryComponent,
                    resolve: {feature: ActorFeatureResolver}
                  },
                  {
                    path: 'frames',
                    component: FeatureFramesComponent,
                    resolve: {feature: ActorFeatureResolver}
                  },
                  {
                    path: 'resources',
                    component: FeatureResourcesComponent,
                    resolve: {feature: ActorFeatureResolver}
                  },
                  {
                    path: 'api',
                    component: FeatureApiComponent,
                    resolve: {feature: ActorFeatureResolver},
                    children: [
                      {
                        path: 'graphql/:index',
                        component: FeatureEditGraphqlComponent,
                        resolve: {index: FeatureGraphqlResolver},
                      }
                    ]
                  },
                  {
                    path: 'issues',
                    component: FeatureIssuesComponent,
                    resolve: {feature: ActorFeatureResolver}
                  },
                  {
                    path: 'markdown',
                    component: FeatureMarkdownComponent,
                    resolve: {
                      project: ProjectResolver,
                      feature: ActorFeatureResolver
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        path: 'terms',
        component: TermsComponent,
        data: {breadcrumb: 'Knowledge'},
        resolve: {spec: SpecResolver}

      },
      {
        path: 'packages',
        component: PackagesComponent,
        data: {breadcrumb: 'Model'},
        resolve: {spec: SpecResolver}

      },
      {
        path: 'validate',
        component: ValidateComponent,
        data: {breadcrumb: 'Validate'},
        resolve: {spec: SpecResolver}

      }
    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpecRoutingModule {
}
