import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActorsComponent } from 'src/app/spec/actors/actors.component';
import { DetailsComponent } from 'src/app/spec/details/details.component';
import { EpicsComponent } from 'src/app/spec/epics/epics.component';
import { PackagesComponent } from 'src/app/spec/packages/packages.component';
import { SpecComponent } from 'src/app/spec/spec.component';
import {
  ActorFeatureResolver,
  ActorResolver, EntityResolver, FeatureGraphqlResolver, PackageResolver,
  ProjectResolver,
  SpecResolver
} from 'src/app/spec/spec.resolvers';
import { SprintComponent } from 'src/app/spec/sprints/sprint/sprint.component';
import { SprintsComponent } from 'src/app/spec/sprints/sprints.component';
import { SprintResolver } from 'src/app/spec/sprints/sprints.resolver';
import { TermsComponent } from 'src/app/spec/terms/terms.component';
import { ValidateComponent } from 'src/app/spec/validate/validate.component';
import { ActorEditComponent } from './actors/actor/edit/actor-edit.component';
import { EntityEditComponent } from './entity/edit/entity-edit.component';
import { EntityFieldsComponent } from './entity/fields/entity-fields.component';
import { FeatureEditGraphqlComponent } from './features/feature/api/edit-graphql/feature-edit-graphql.component';
import { FeatureApiComponent } from './features/feature/api/feature-api.component';
import { FeatureEditComponent } from './features/feature/edit/feature-edit.component';
import { FeatureFramesComponent } from './features/feature/frames/feature-frames.component';
import { FeatureIssuesComponent } from './features/feature/issues/feature-issues.component';
import { FeatureMarkdownComponent } from './features/feature/markdown/feature-markdown.component';
import { FeatureResourcesComponent } from './features/feature/resources/feature-resources.component';
import { FeatureStoryComponent } from './features/feature/story/feature-story.component';
import { FeaturesComponent } from './features/features.component';
import { ModelComponent } from './model/model.component';
import { PackageEditComponent } from './package/edit/package-edit.component';
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
        path: 'actors',
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
            data: {breadcrumb: {label: getActor, disabled: true}},
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
                        path: 'graphql/:id',
                        component: FeatureEditGraphqlComponent,
                        resolve: {query: FeatureGraphqlResolver},
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
        component: ModelComponent,
        data: {breadcrumb: 'Model'},
        children: [
          {
            path: '',
            component: PackagesComponent,
            resolve: {spec: SpecResolver}
          },
          {
            path: ':pack',
            component: PackageEditComponent,
            resolve: {pack: PackageResolver},
            children: [
              {
                path: 'entities/:entity',
                component: EntityEditComponent,
                resolve: {entity: EntityResolver},
                children: [
                  {
                    path: '',
                    pathMatch: 'full',
                    redirectTo: 'fields'
                  },
                  {
                    path: 'fields',
                    component: EntityFieldsComponent
                  }
                ]
              }
            ]
          }
        ]
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
