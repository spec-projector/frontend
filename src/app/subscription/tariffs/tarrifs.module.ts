import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  ArrayPipesModule,
  ButtonModule,
  CardModule, CheckboxModule, DatePeriodModule,
  GridModule,
  IconModule,
  LabelModule,
  LinkModule,
  MessageModule, PopoverModule, SkeletonModule,
  StackModule
} from '@junte/ui';
import { TariffsComponent } from './tariffs.component';
import {AnalyticsDirectivesModule} from 'src/directives/analytics.module';

@NgModule({
  declarations: [
    TariffsComponent
  ],
  exports: [
    TariffsComponent
  ],
  imports: [
    CommonModule,

    GridModule,
    StackModule,
    CardModule,
    IconModule,
    PopoverModule,
    ButtonModule,
    ArrayPipesModule,
    LabelModule,
    MessageModule,
    LinkModule,
    DatePeriodModule,
    SkeletonModule,
    CheckboxModule,
    ReactiveFormsModule,

    AnalyticsDirectivesModule
  ]
})
export class TariffsModule {

}
