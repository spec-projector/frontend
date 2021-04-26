import {DragDropModule} from '@angular/cdk/drag-drop';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {JunteUiModule} from '@junte/ui';
import {ClickOutsideModule} from 'ng4-click-outside';
import {ClipboardService} from 'ngx-clipboard';
import {DndModule} from 'ngx-drag-drop';
import {MonacoEditorModule} from 'ngx-monaco-editor';
import {ActorComponent} from 'src/app/spec/actors/actor/actor.component';
import {ActorsComponent} from 'src/app/spec/actors/actors.component';
import {DetailsComponent} from 'src/app/spec/details/details.component';
import {EnumComponent} from 'src/app/spec/model/enums/enum/enum.component';
import {ModuleComponent} from 'src/app/spec/modules/module/module.component';
import {ModulesComponent} from 'src/app/spec/modules/modules.component';
import {FeatureEditGraphqlComponent} from 'src/app/spec/features/feature/api/edit-graphql/feature-edit-graphql.component';
import {FeatureComponent} from 'src/app/spec/features/feature/feature.component';
import {FeatureAddFrameComponent} from 'src/app/spec/features/feature/frames/add-frame/feature-add-frame.component';
import {FeatureFramesComponent} from 'src/app/spec/features/feature/frames/feature-frames.component';
import {FeatureMarkdownComponent} from 'src/app/spec/features/feature/markdown/feature-markdown.component';
import {StoryEntryComponent} from 'src/app/spec/features/feature/story/entry/story-entry.component';
import {FeatureStoryComponent} from 'src/app/spec/features/feature/story/feature-story.component';
import {AttachIssueComponent} from 'src/app/spec/features/feature/issues/attach-issue/attach-issue.component';
import {FeatureIssuesComponent} from 'src/app/spec/features/feature/issues/feature-issues.component';
import {TokensComponent} from 'src/app/shared/tokens/tokens.component';
import {SpecRoutingModule} from 'src/app/spec/spec-routing.module';
import {SpecComponent} from 'src/app/spec/spec.component';
import {ActorFeatureResolver, ActorResolver, ProjectResolver, SpecResolver} from 'src/app/spec/spec.resolvers';
import {SprintComponent} from 'src/app/spec/sprints/sprint/sprint.component';
import {SprintsComponent} from 'src/app/spec/sprints/sprints.component';
import {SprintResolver} from 'src/app/spec/sprints/sprints.resolver';
import {TermComponent} from 'src/app/spec/terms/term/term.component';
import {TermsComponent} from 'src/app/spec/terms/terms.component';
import {ValidateComponent} from 'src/app/spec/validate/validate.component';
import {FitWidthDirective} from 'src/directives/fit-width.directive';
import {SpecManager} from 'src/managers/spec.manager';
import {ActorPricePipe} from './actors/pipes';
import {FeaturePricePipe} from './features/pipes';
import {FeatureTermsPipe} from './features/pipes';
import {FeaturesPipe} from 'src/app/spec/features/pipes';
import {GroupFeaturesByActorPipe, GroupFeaturesByModulesPipe} from './features/pipes';
import {SpecPricePipe} from './pipes';
import {TermDescriptionPipe} from 'src/pipes/terms/description';
import {SameFirstCharPipe} from 'src/pipes/terms/same-first-char';
import {SortByNamePipe} from 'src/pipes/terms/sort-by-name';
import {TokenTypePipe} from 'src/pipes/token-type';
import {JoinTokensPipe} from 'src/pipes/tokens/join';
import {StringPipesModule} from '../../pipes/string/string-pipes.module';
import {ProjectEditModule} from '../projects/edit-project/edit-projects.module';
import {ActorEditComponent} from './actors/actor/edit/actor-edit.component';
import {EntityEditComponent} from './model/entities/entity/edit/entity-edit.component';
import {EntityComponent} from './model/entities/entity/entity.component';
import {EntityFieldsComponent} from './model/entities/entity/fields/entity-fields.component';
import {EntityFieldComponent} from './model/entities/entity/fields/field/entity-field.component';
import {EnumEditComponent} from './model/enums/enum/edit/enum-edit.component';
import {EnumOptionComponent} from './model/enums/enum/option/enum-option.component';
import {FeatureApiComponent} from './features/feature/api/feature-api.component';
import {GraphqlPlaygroundPipe} from './features/feature/api/pipes';
import {FeatureEditComponent} from './features/feature/edit/feature-edit.component';
import {EstimatedTimePipe, SpentTimePipe} from './features/feature/pipes';
import {FeatureResourcesComponent} from './features/feature/resources/feature-resources.component';
import {FeaturesComponent} from './features/features.component';
import {EntitiesComponent} from './model/entities/entities.component';
import {EnumsComponent} from './model/enums/enums.component';
import {ModelComponent} from './model/model.component';
import {ModulesIdsPipe} from './modules/pipes';
import {PrintComponent} from './print/print.component';
import {SchemeInvalidComponent} from './scheme/scheme-invalid.component';
import {GroupEntitiesByModulesPipe} from './model/entities/pipes';
import { WorkflowStepComponent } from './features/feature/workflow/step/step.component';
import {ArrayPipesModule} from '../../pipes/array/array-pipes.module';

@NgModule({
  declarations: [
    SpecComponent,

    SchemeInvalidComponent,
    DetailsComponent,

    ActorsComponent,
    ActorComponent,
    ActorEditComponent,

    FeaturesComponent,
    FeatureComponent,
    FeatureEditComponent,
    FeatureStoryComponent,
    FeatureFramesComponent,
    FeatureAddFrameComponent,
    FeatureResourcesComponent,
    FeatureApiComponent,
    FeatureEditGraphqlComponent,
    FeatureIssuesComponent,
    GraphqlPlaygroundPipe,
    FeatureMarkdownComponent,
    AttachIssueComponent,
    WorkflowStepComponent,

    ModelComponent,
    EntitiesComponent,
    EnumsComponent,

    EntityComponent,
    EntityEditComponent,
    EntityFieldsComponent,
    EntityFieldComponent,
    GroupEntitiesByModulesPipe,

    EnumComponent,
    EnumEditComponent,
    EnumOptionComponent,

    ModulesComponent,
    ModuleComponent,
    ModulesIdsPipe,

    SprintsComponent,

    SpentTimePipe,
    EstimatedTimePipe,

    TermsComponent,
    ValidateComponent,


    PrintComponent,

    TokensComponent,
    SprintComponent,


    TermComponent,
    FitWidthDirective,

    StoryEntryComponent,
    TokenTypePipe,
    GroupFeaturesByModulesPipe,
    GroupFeaturesByActorPipe,
    FeatureTermsPipe,
    FeaturesPipe,
    JoinTokensPipe,
    SameFirstCharPipe,
    SortByNamePipe,
    TermDescriptionPipe,

    FeaturePricePipe,
    ActorPricePipe,
    SpecPricePipe
  ],
  entryComponents: [
    FeatureEditGraphqlComponent
  ],
  imports: [
    SpecRoutingModule,
    CommonModule,
    JunteUiModule,
    ReactiveFormsModule,
    ClickOutsideModule,
    DndModule,
    DragDropModule,
    MonacoEditorModule,
    StringPipesModule,
    ArrayPipesModule,

    ProjectEditModule
  ],
  providers: [
    SpecResolver,
    SprintResolver,
    ProjectResolver,
    ActorFeatureResolver,
    ClipboardService,
    SpecManager,
    ActorResolver
  ]
})
export class SpecModule {

}
