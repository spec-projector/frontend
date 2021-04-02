import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActorsComponent } from 'src/app/spec/actors/actors.component';
import { DetailsComponent } from 'src/app/spec/details/details.component';
import { EpicsComponent } from 'src/app/spec/epics/epics.component';
import { PackagesComponent } from 'src/app/spec/packages/packages.component';
import { SpecComponent } from 'src/app/spec/spec.component';
import {
  ActorFeatureResolver,
  ActorResolver,
  EntityResolver, EnumResolver,
  FeatureGraphqlResolver,
  PackageResolver,
  ProjectResolver,
  SpecResolver
} from 'src/app/spec/spec.resolvers';
import { SprintComponent } from 'src/app/spec/sprints/sprint/sprint.component';
import { SprintsComponent } from 'src/app/spec/sprints/sprints.component';
import { SprintResolver } from 'src/app/spec/sprints/sprints.resolver';
import { TermsComponent } from 'src/app/spec/terms/terms.component';
import { ValidateComponent } from 'src/app/spec/validate/validate.component';
import { Enum } from '../../models/spec/orm/enum';
import { ActorEditComponent } from './actors/actor/edit/actor-edit.component';
import { EntityEditComponent } from './entity/edit/entity-edit.component';
import { EntityFieldsComponent } from './entity/fields/entity-fields.component';
import { EnumEditComponent } from './enum/edit/enum-edit.component';
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
import { PackageEditComponent } from './packages/package/edit/package-edit.component';
import { PrintComponent } from './print/print.component';
import { Package } from '../../models/spec/orm/package';
import { Project } from '../../models/projects';
import { Actor } from '../../models/spec/planning/actor';
import { Entity } from '../../models/spec/orm/entity';
import { SchemeInvalidComponent } from './scheme/scheme-invalid.component';

export function getProject({project}: { project: Project }) {
  return project.title;
}

export function getActor({actor}: { actor: Actor }) {
  return actor.name;
}

export function getPackage({pack}: { pack: Package }) {
  return pack.title;
}

export function getEntity({entity}: { entity: Entity }) {
  return entity.title;
}

export function getEnum({enum: _enum}: { enum: Enum }) {
  return _enum.title;
}

export function getSprint({sprint}) {
  return sprint.title;
}

export function getFeature({feature}) {
  return feature.title;
}

export const GENERAL_BREADCRUMB = $localize`:@@label.general:General`;
export const PRINT_BREADCRUMB = $localize`:@@label.print:Print`;
export const SPRINTS_BREADCRUMB = $localize`:@@label.sprints:Sprints`;
export const EPICS_BREADCRUMB = $localize`:@@label.epics:Epics`;
export const ACTORS_BREADCRUMB = $localize`:@@label.actors:Actors`;
export const KNOWLEDGE_BREADCRUMB = $localize`:@@label.knowledge:Knowledge`;
export const MODEL_BREADCRUMB = $localize`:@@label.model:Model`;
export const VALIDATE_BREADCRUMB = $localize`:@@label.validate:Validate`;

export const routes: Routes = [
  {
    path: 'updating',
    component: SchemeInvalidComponent,
  },
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
        redirectTo: 'actors'
      },
      {
        path: 'details',
        component: DetailsComponent,
        data: {breadcrumb: GENERAL_BREADCRUMB}
      },
      {
        path: 'print',
        component: PrintComponent,
        data: {breadcrumb: PRINT_BREADCRUMB}
      },
      {
        path: 'sprints',
        data: {breadcrumb: SPRINTS_BREADCRUMB},
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
        data: {breadcrumb: EPICS_BREADCRUMB},
        resolve: {spec: SpecResolver}

      },
      {
        path: 'actors',
        component: FeaturesComponent,
        data: {breadcrumb: ACTORS_BREADCRUMB},
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
                    resolve: {
                      feature: ActorFeatureResolver,
                      project: ProjectResolver
                    }
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
                    resolve: {
                      feature: ActorFeatureResolver,
                      project: ProjectResolver
                    }
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
        data: {breadcrumb: KNOWLEDGE_BREADCRUMB},
        resolve: {spec: SpecResolver}

      },
      {
        path: 'packages',
        component: ModelComponent,
        data: {breadcrumb: MODEL_BREADCRUMB},
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
            data: {breadcrumb: {label: getPackage, disabled: true}},
            children: [
              {
                path: 'entities/:entity',
                component: EntityEditComponent,
                resolve: {entity: EntityResolver},
                data: {breadcrumb: {label: getEntity}},
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
              },
              {
                path: 'enums/:enum',
                component: EnumEditComponent,
                resolve: {enum: EnumResolver},
                data: {breadcrumb: {label: getEnum}}
              }
            ]
          }
        ]
      },
      {
        path: 'validate',
        component: ValidateComponent,
        data: {breadcrumb: VALIDATE_BREADCRUMB},
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
