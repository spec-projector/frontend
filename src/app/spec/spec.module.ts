import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { JunteUiModule } from '@junte/ui';
import { ClickOutsideModule } from 'ng4-click-outside';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { ActorComponent } from 'src/app/spec/actors/actor/actor.component';
import { ActorsComponent } from 'src/app/spec/actors/actors.component';
import { SettingsComponent } from 'src/app/spec/settings/settings.component';
import { FeatureEditGraphqlComponent } from 'src/app/spec/features/feature/api/edit-graphql/feature-edit-graphql.component';
import { FeatureComponent } from 'src/app/spec/features/feature/feature.component';
import { FeatureAddFrameComponent } from 'src/app/spec/features/feature/frames/add-frame/feature-add-frame.component';
import { FeatureFramesComponent } from 'src/app/spec/features/feature/frames/feature-frames.component';
import { AttachIssueComponent } from 'src/app/spec/features/feature/issues/attach-issue/attach-issue.component';
import { FeatureIssuesComponent } from 'src/app/spec/features/feature/issues/feature-issues.component';
import { FeatureMarkdownComponent } from 'src/app/spec/features/feature/markdown/feature-markdown.component';
import { FeatureStoryEntryComponent } from 'src/app/spec/features/feature/story/entry/story-entry.component';
import { FeatureStoryComponent } from 'src/app/spec/features/feature/story/feature-story.component';
import { EnumComponent } from 'src/app/spec/model/enums/enum/enum.component';
import { ModuleComponent } from 'src/app/spec/modules/module/module.component';
import { ModulesComponent } from 'src/app/spec/modules/modules.component';
import { SpecRoutingModule } from 'src/app/spec/spec-routing.module';
import { SpecComponent } from 'src/app/spec/spec.component';
import { SprintComponent } from 'src/app/spec/sprints/sprint/sprint.component';
import { SprintsComponent } from 'src/app/spec/sprints/sprints.component';
import { TermDescriptionPipe } from 'src/app/spec/terms/pipes';
import { TermComponent } from 'src/app/spec/terms/term/term.component';
import { TermsComponent } from 'src/app/spec/terms/terms.component';
import { JoinTokensPipe, TokenTypePipe } from 'src/app/spec/tokens/pipes';
import { TokensComponent } from 'src/app/spec/tokens/tokens.component';
import { FitHeightDirective } from '../../directives/fit-height.directive';
import { ArrayPipesModule } from '../../pipes/array/array-pipes.module';
import { StringPipesModule } from '../../pipes/string/string-pipes.module';
import { ProjectEditModule } from '../projects/edit-project/edit-projects.module';
import { ActorEditComponent } from './actors/actor/edit/actor-edit.component';
import { ActorPricePipe } from './actors/pipes';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FeatureApiComponent } from './features/feature/api/feature-api.component';
import { GraphqlPlaygroundPipe } from './features/feature/api/pipes';
import { FeatureEditComponent } from './features/feature/edit/feature-edit.component';
import { AddFigmaKeyComponent } from './features/feature/frames/add-figma-key/add-figma-key.component';
import { EstimatedTimePipe, SpentTimePipe } from './features/feature/pipes';
import { FeatureResourcesComponent } from './features/feature/resources/feature-resources.component';
import { WorkflowStepComponent } from './features/feature/workflow/step/step.component';
import { FeatureWorkflowComponent } from './features/feature/workflow/workflow.component';
import { FeaturesComponent } from './features/features.component';
import {
  FeaturePricePipe,
  FeaturesWithoutModulePipe,
  FeaturesWithoutSprintPipe,
  FeatureTermsPipe,
  GroupFeaturesByActorPipe,
  GroupFeaturesByModulesPipe
} from './features/pipes';
import { EntitiesComponent } from './model/entities/entities.component';
import { EntityEditComponent } from './model/entities/entity/edit/entity-edit.component';
import { EntityComponent } from './model/entities/entity/entity.component';
import { EntityFieldsComponent } from './model/entities/entity/fields/entity-fields.component';
import { EntityFieldComponent } from './model/entities/entity/fields/field/entity-field.component';
import { EntitiesWithoutModulePipe, GroupEntitiesByModulesPipe } from './model/entities/pipes';
import { EnumEditComponent } from './model/enums/enum/edit/enum-edit.component';
import { EnumOptionComponent } from './model/enums/enum/option/enum-option.component';
import { EnumsComponent } from './model/enums/enums.component';
import { EnumsWithoutModulePipe, GroupEnumsByModulesPipe } from './model/enums/pipes';
import { ModelComponent } from './model/model.component';
import { SpecPricePipe } from './pipes';
import { PrintComponent } from './print/print.component';
import { SchemeInvalidComponent } from './scheme/scheme-invalid.component';
import { MaintenanceComponent } from './settings/maintenance/maintenance.component';
import { ResourceTypesComponent } from './settings/resources/resource-types.component';
import { StaffComponent } from './settings/staff/staff.component';

@NgModule({
  declarations: [
    SpecComponent,

    DashboardComponent,

    ActorsComponent,
    ActorComponent,
    ActorEditComponent,

    FeaturesComponent,
    FeatureComponent,
    FeatureEditComponent,
    FeatureWorkflowComponent,
    FeatureStoryComponent,
    FeatureStoryEntryComponent,
    FeatureFramesComponent,
    FeatureAddFrameComponent,
    AddFigmaKeyComponent,
    FeatureResourcesComponent,
    FeatureApiComponent,
    FeatureEditGraphqlComponent,
    FeatureIssuesComponent,
    GraphqlPlaygroundPipe,
    FeatureMarkdownComponent,
    AttachIssueComponent,
    WorkflowStepComponent,
    FeatureTermsPipe,
    GroupFeaturesByActorPipe,
    GroupFeaturesByModulesPipe,
    FeaturesWithoutModulePipe,
    FeaturesWithoutSprintPipe,

    TermsComponent,
    TermComponent,
    TermDescriptionPipe,

    ModelComponent,

    EntitiesComponent,
    EntityComponent,
    EntityEditComponent,
    EntityFieldsComponent,
    EntityFieldComponent,
    GroupEntitiesByModulesPipe,
    EntitiesWithoutModulePipe,

    EnumsComponent,
    EnumComponent,
    EnumEditComponent,
    EnumOptionComponent,
    GroupEnumsByModulesPipe,
    EnumsWithoutModulePipe,

    ModulesComponent,
    ModuleComponent,

    SprintsComponent,
    SprintComponent,

    SpentTimePipe,
    EstimatedTimePipe,

    PrintComponent,

    SettingsComponent,
    ResourceTypesComponent,
    MaintenanceComponent,
    StaffComponent,

    TokensComponent,

    SchemeInvalidComponent,

    TokenTypePipe,
    JoinTokensPipe,

    FeaturePricePipe,
    ActorPricePipe,
    SpecPricePipe,

    FitHeightDirective
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MonacoEditorModule.forRoot(),
    JunteUiModule,
    ClickOutsideModule,
    DragDropModule,

    StringPipesModule,
    ArrayPipesModule,

    ProjectEditModule,

    SpecRoutingModule
  ]
})
export class SpecModule {

}
