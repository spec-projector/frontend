import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { JunteUiModule } from '@junte/ui';
import { ClickOutsideModule } from 'ng4-click-outside';
import { ClipboardService } from 'ngx-clipboard';
import { DndModule } from 'ngx-drag-drop';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { ActorComponent } from 'src/app/components/spec/actors/actor/actor.component';
import { ActorsComponent } from 'src/app/components/spec/actors/actors.component';
import { DetailsComponent } from 'src/app/components/spec/details/details.component';
import { EntityFieldComponent } from 'src/app/components/spec/entity/fields/field/entity-field.component';
import { EntityComponent } from 'src/app/components/spec/entity/entity.component';
import { EpicComponent } from 'src/app/components/spec/epics/epic/epic.component';
import { EpicsComponent } from 'src/app/components/spec/epics/epics.component';
import { FeatureEditGraphqlComponent } from 'src/app/components/spec/features/feature/api/edit-graphql/feature-edit-graphql.component';
import { FeatureComponent } from 'src/app/components/spec/features/feature/feature.component';
import { FeatureAddFrameComponent } from 'src/app/components/spec/features/feature/frames/add-frame/feature-add-frame.component';
import { FeatureFramesComponent } from 'src/app/components/spec/features/feature/frames/feature-frames.component';
import { FeatureMarkdownComponent } from 'src/app/components/spec/features/feature/markdown/feature-markdown.component';
import { StoryEntryComponent } from 'src/app/components/spec/features/feature/story/entry/story-entry.component';
import { FeatureStoryComponent } from 'src/app/components/spec/features/feature/story/feature-story.component';
import { PackageComponent } from 'src/app/components/spec/packages/package/package.component';
import { PackagesComponent } from 'src/app/components/spec/packages/packages.component';
import { AttachIssueComponent } from 'src/app/components/spec/features/feature/issues/attach-issue/attach-issue.component';
import { FeatureIssuesComponent } from 'src/app/components/spec/features/feature/issues/feature-issues.component';
import { TokensComponent } from 'src/app/components/spec/shared/tokens/tokens.component';
import { SpecRoutingModule } from 'src/app/components/spec/spec-routing.module';
import { SpecComponent } from 'src/app/components/spec/spec.component';
import { ActorFeatureResolver, ActorResolver, ProjectResolver, SpecResolver } from 'src/app/components/spec/spec.resolvers';
import { SprintComponent } from 'src/app/components/spec/sprints/sprint/sprint.component';
import { SprintsComponent } from 'src/app/components/spec/sprints/sprints.component';
import { SprintResolver } from 'src/app/components/spec/sprints/sprints.resolver';
import { TermComponent } from 'src/app/components/spec/terms/term/term.component';
import { TermsComponent } from 'src/app/components/spec/terms/terms.component';
import { ValidateComponent } from 'src/app/components/spec/validate/validate.component';
import { FitWidthDirective } from 'src/app/directives/fit-width.directive';
import { SpecManager } from 'src/app/managers/spec.manager';
import { ActorPricePipe } from 'src/app/pipes/actors/actor-price';
import { FeaturePricePipe } from 'src/app/pipes/features/feature-price';
import { FeatureTermsPipe } from 'src/app/pipes/features/feature-terms';
import { FeaturesPipe } from 'src/app/pipes/features/features';
import { GroupEntitiesPipe } from 'src/app/pipes/group-entities';
import { GroupFeaturesByActorPipe, GroupFeaturesByEpicPipe } from 'src/app/pipes/group-features';
import { SpecPricePipe } from 'src/app/pipes/spec/actor-price';
import { EncodeURIPipe } from 'src/app/pipes/string/encode-uri';
import { TermDescriptionPipe } from 'src/app/pipes/terms/description';
import { SameFirstCharPipe } from 'src/app/pipes/terms/same-first-char';
import { SortByNamePipe } from 'src/app/pipes/terms/sort-by-name';
import { TokenTypePipe } from 'src/app/pipes/token-type';
import { JoinTokensPipe } from 'src/app/pipes/tokens/join';
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
import { SpaceSyncComponent } from './shared/sync/space-sync.component';

@NgModule({
  declarations: [
    SpecComponent,
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

    SpaceSyncComponent,
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
    SpaceSyncComponent,
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
    MonacoEditorModule
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
