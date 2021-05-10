import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActorsComponent } from 'src/app/spec/actors/actors.component';
import { SettingsComponent } from 'src/app/spec/settings/settings.component';
import { ModulesComponent } from 'src/app/spec/modules/modules.component';
import { SpecComponent } from 'src/app/spec/spec.component';
import {
  FeatureResolver,
  ActorResolver,
  EntityResolver,
  EnumResolver,
  FeatureGraphqlResolver,
  ProjectResolver,
  SpecResolver
} from 'src/app/spec/resolvers';
import { TermsComponent } from 'src/app/spec/terms/terms.component';
import { Project } from '../../models/projects';
import { Entity } from '../../models/spec/orm/entity';
import { Enum } from '../../models/spec/orm/enum';
import { Actor } from '../../models/spec/planning/actor';
import { MeUserResolver } from '../../resolvers/me';
import { ActorEditComponent } from './actors/actor/edit/actor-edit.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FeatureEditGraphqlComponent } from './features/feature/api/edit-graphql/feature-edit-graphql.component';
import { FeatureApiComponent } from './features/feature/api/feature-api.component';
import { FeatureEditComponent } from './features/feature/edit/feature-edit.component';
import { FeatureFramesComponent } from './features/feature/frames/feature-frames.component';
import { FeatureIssuesComponent } from './features/feature/issues/feature-issues.component';
import { FeatureMarkdownComponent } from './features/feature/markdown/feature-markdown.component';
import { FeatureResourcesComponent } from './features/feature/resources/feature-resources.component';
import { FeatureStoryComponent } from './features/feature/story/feature-story.component';
import { FeatureWorkflowComponent } from './features/feature/workflow/workflow.component';
import { FeaturesComponent } from './features/features.component';
import { EntitiesComponent } from './model/entities/entities.component';
import { EntityEditComponent } from './model/entities/entity/edit/entity-edit.component';
import { EntityFieldsComponent } from './model/entities/entity/fields/entity-fields.component';
import { EnumEditComponent } from './model/enums/enum/edit/enum-edit.component';
import { EnumsComponent } from './model/enums/enums.component';
import { ModelComponent } from './model/model.component';
import { PrintComponent } from './print/print.component';
import { SchemeInvalidComponent } from './scheme/scheme-invalid.component';
import { MaintenanceComponent } from './settings/maintenance/maintenance.component';
import { ResourceTypesComponent } from './settings/resources/resource-types.component';
import { StaffComponent } from './settings/staff/staff.component';
import { SprintsComponent } from './sprints/sprints.component';
import { joinTokens } from './tokens/utils';

export const DASHBOARD_BREADCRUMB = $localize`:@@label.dashboard:Dashboard`;
export const SPRINTS_BREADCRUMB = $localize`:@@label.sprints:Sprints`;
export const MODULES_BREADCRUMB = $localize`:@@label.modules:Modules`;
export const FEATURES_BREADCRUMB = $localize`:@@label.features:Feature`;
export const ACTORS_BREADCRUMB = $localize`:@@label.actors:Actors`;
export const TERMS_BREADCRUMB = $localize`:@@label.terms:Terms`;
export const MODEL_BREADCRUMB = $localize`:@@label.model:Model`;
export const ENTITIES_BREADCRUMB = $localize`:@@label.entities:Entities`;
export const ENUMS_BREADCRUMB = $localize`:@@label.enums:Enums`;
export const PRINT_BREADCRUMB = $localize`:@@label.print:Print`;
export const SETTINGS_BREADCRUMB = $localize`:@@label.settings:Settings`;

export function getProject({project}: { project: Project }) {
  return project.title;
}

export function getActor({actor}: { actor: Actor }) {
  return actor.name;
}

export function getEntity({entity}: { entity: Entity }) {
  return entity.title;
}

export function getEnum({enum: _enum}: { enum: Enum }) {
  return _enum.title;
}

export function getFeature({feature}) {
  return joinTokens(feature.title);
}

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
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: {breadcrumb: DASHBOARD_BREADCRUMB}
      },
      {
        path: 'actors',
        component: FeaturesComponent,
        data: {breadcrumb: FEATURES_BREADCRUMB},
        children: [
          {
            path: '',
            component: ActorsComponent,
            data: {breadcrumb: ACTORS_BREADCRUMB},
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
                resolve: {feature: FeatureResolver},
                children: [
                  {
                    path: '',
                    pathMatch: 'full',
                    redirectTo: 'workflow'
                  },
                  {
                    path: 'workflow',
                    component: FeatureWorkflowComponent,
                    resolve: {feature: FeatureResolver}
                  },
                  {
                    path: 'story',
                    component: FeatureStoryComponent,
                    resolve: {feature: FeatureResolver}
                  },
                  {
                    path: 'frames',
                    component: FeatureFramesComponent,
                    resolve: {
                      feature: FeatureResolver,
                      project: ProjectResolver
                    }
                  },
                  {
                    path: 'resources',
                    component: FeatureResourcesComponent,
                    resolve: {feature: FeatureResolver}
                  },
                  {
                    path: 'api',
                    component: FeatureApiComponent,
                    resolve: {feature: FeatureResolver},
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
                      feature: FeatureResolver,
                      project: ProjectResolver
                    }
                  },
                  {
                    path: 'markdown',
                    component: FeatureMarkdownComponent,
                    resolve: {
                      project: ProjectResolver,
                      feature: FeatureResolver
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
        data: {breadcrumb: TERMS_BREADCRUMB},
        resolve: {spec: SpecResolver}

      },
      {
        path: 'model',
        component: ModelComponent,
        data: {breadcrumb: MODEL_BREADCRUMB},
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'entities'
          },
          {
            path: 'entities',
            data: {breadcrumb: ENTITIES_BREADCRUMB},
            children: [
              {
                path: '',
                pathMatch: 'full',
                component: EntitiesComponent,
                resolve: {spec: SpecResolver}
              },
              {
                path: ':entity',
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
            ]
          },
          {
            path: 'enums',
            data: {breadcrumb: ENUMS_BREADCRUMB},
            children: [
              {
                path: '',
                pathMatch: 'full',
                component: EnumsComponent,
                resolve: {spec: SpecResolver}
              },
              {
                path: ':enum',
                component: EnumEditComponent,
                resolve: {enum: EnumResolver},
                data: {breadcrumb: {label: getEnum}}
              }
            ]
          }
        ]
      },
      {
        path: 'modules',
        component: ModulesComponent,
        data: {breadcrumb: MODULES_BREADCRUMB},
        resolve: {spec: SpecResolver}

      },
      {
        path: 'sprints',
        component: SprintsComponent,
        data: {breadcrumb: SPRINTS_BREADCRUMB}
      },
      {
        path: 'print',
        component: PrintComponent,
        data: {breadcrumb: PRINT_BREADCRUMB}
      },
      {
        path: 'settings',
        component: SettingsComponent,
        data: {breadcrumb: SETTINGS_BREADCRUMB},
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'resources'
          },
          {
            path: 'resources',
            component: ResourceTypesComponent,
            resolve: {spec: SpecResolver}
          },
          {
            path: 'maintenance',
            component: MaintenanceComponent,
            resolve: {spec: SpecResolver}
          },
          {
            path: 'staff',
            component: StaffComponent,
            resolve: {spec: SpecResolver}
          }
        ]
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
