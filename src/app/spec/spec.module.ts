import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { JunteUiModule } from '@junte/ui';
import { ClickOutsideModule } from 'ng4-click-outside';
import { ClipboardService } from 'ngx-clipboard';
import { DndModule } from 'ngx-drag-drop';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { ActorComponent } from 'src/app/spec/actors/actor/actor.component';
import { ActorsComponent } from 'src/app/spec/actors/actors.component';
import { DetailsComponent } from 'src/app/spec/details/details.component';
import { EntityFieldComponent } from 'src/app/spec/entity/fields/field/entity-field.component';
import { EntityComponent } from 'src/app/spec/entity/entity.component';
import { EpicComponent } from 'src/app/spec/epics/epic/epic.component';
import { EpicsComponent } from 'src/app/spec/epics/epics.component';
import { FeatureEditGraphqlComponent } from 'src/app/spec/features/feature/api/edit-graphql/feature-edit-graphql.component';
import { FeatureComponent } from 'src/app/spec/features/feature/feature.component';
import { FeatureAddFrameComponent } from 'src/app/spec/features/feature/frames/add-frame/feature-add-frame.component';
import { FeatureFramesComponent } from 'src/app/spec/features/feature/frames/feature-frames.component';
import { FeatureMarkdownComponent } from 'src/app/spec/features/feature/markdown/feature-markdown.component';
import { StoryEntryComponent } from 'src/app/spec/features/feature/story/entry/story-entry.component';
import { FeatureStoryComponent } from 'src/app/spec/features/feature/story/feature-story.component';
import { PackageComponent } from 'src/app/spec/packages/package/package.component';
import { PackagesComponent } from 'src/app/spec/packages/packages.component';
import { AttachIssueComponent } from 'src/app/spec/features/feature/issues/attach-issue/attach-issue.component';
import { FeatureIssuesComponent } from 'src/app/spec/features/feature/issues/feature-issues.component';
import { TokensComponent } from 'src/app/shared/tokens/tokens.component';
import { SpecRoutingModule } from 'src/app/spec/spec-routing.module';
import { SpecComponent } from 'src/app/spec/spec.component';
import { ActorFeatureResolver, ActorResolver, ProjectResolver, SpecResolver } from 'src/app/spec/spec.resolvers';
import { SprintComponent } from 'src/app/spec/sprints/sprint/sprint.component';
import { SprintsComponent } from 'src/app/spec/sprints/sprints.component';
import { SprintResolver } from 'src/app/spec/sprints/sprints.resolver';
import { TermComponent } from 'src/app/spec/terms/term/term.component';
import { TermsComponent } from 'src/app/spec/terms/terms.component';
import { ValidateComponent } from 'src/app/spec/validate/validate.component';
import { FitWidthDirective } from 'src/directives/fit-width.directive';
import { SpecManager } from 'src/managers/spec.manager';
import { ActorPricePipe } from 'src/pipes/actors/actor-price';
import { FeaturePricePipe } from 'src/pipes/features/feature-price';
import { FeatureTermsPipe } from 'src/pipes/features/feature-terms';
import { FeaturesPipe } from 'src/pipes/features/features';
import { GroupEntitiesPipe } from 'src/pipes/group-entities';
import { GroupFeaturesByActorPipe, GroupFeaturesByEpicPipe } from 'src/pipes/group-features';
import { SpecPricePipe } from 'src/pipes/spec/actor-price';
import { EncodeURIPipe } from 'src/pipes/string/encode-uri';
import { TermDescriptionPipe } from 'src/pipes/terms/description';
import { SameFirstCharPipe } from 'src/pipes/terms/same-first-char';
import { SortByNamePipe } from 'src/pipes/terms/sort-by-name';
import { TokenTypePipe } from 'src/pipes/token-type';
import { JoinTokensPipe } from 'src/pipes/tokens/join';
import { ProjectEditModule } from '../projects/edit-project/edit-projects.module';
import { ActorEditComponent } from './actors/actor/edit/actor-edit.component';
import { EntityEditComponent } from './entity/edit/entity-edit.component';
import { EntityFieldsComponent } from './entity/fields/entity-fields.component';
import { FeatureApiComponent } from './features/feature/api/feature-api.component';
import { GraphqlPlaygroundPipe } from './features/feature/api/pipes';
import { FeatureEditComponent } from './features/feature/edit/feature-edit.component';
import { EstimatedTimePipe, SpentTimePipe } from './features/feature/pipes';
import { FeatureResourcesComponent } from './features/feature/resources/feature-resources.component';
import { FeaturesComponent } from './features/features.component';
import { ModelComponent } from './model/model.component';
import { PackageEditComponent } from './package/edit/package-edit.component';
import { PrintComponent } from './print/print.component';
import { SchemeInvalidComponent } from './scheme/scheme-invalid.component';

@NgModule({
  declarations: [
    SpecComponent,

    SchemeInvalidComponent,
    DetailsComponent,

    FeaturesComponent,
    ActorsComponent,
    ActorComponent,
    ActorEditComponent,
    FeatureComponent,

    FeatureEditComponent,
    FeatureStoryComponent,
    FeatureFramesComponent,
    FeatureAddFrameComponent,
    FeatureResourcesComponent,
    FeatureApiComponent,
    FeatureEditGraphqlComponent,
    GraphqlPlaygroundPipe,
    FeatureIssuesComponent,
    AttachIssueComponent,
    FeatureMarkdownComponent,

    ModelComponent,
    PackagesComponent,
    PackageEditComponent,
    EntityComponent,
    EntityEditComponent,
    EntityFieldsComponent,
    EntityFieldComponent,

    SprintsComponent,
    EpicsComponent,
    EpicComponent,

    SpentTimePipe,
    EstimatedTimePipe,

    TermsComponent,
    ValidateComponent,


    PrintComponent,

    TokensComponent,
    SprintComponent,


    TermComponent,
    PackageComponent,
    FitWidthDirective,

    StoryEntryComponent,
    TokenTypePipe,
    GroupFeaturesByEpicPipe,
    GroupFeaturesByActorPipe,
    FeatureTermsPipe,
    GroupEntitiesPipe,
    FeaturesPipe,
    JoinTokensPipe,
    SameFirstCharPipe,
    SortByNamePipe,
    TermDescriptionPipe,

    EncodeURIPipe,
    FeaturePricePipe,
    ActorPricePipe,
    SpecPricePipe,
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
