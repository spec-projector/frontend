import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { JunteUiModule } from 'junte-ui';
import { ArrayPipesModule } from 'src/app/pipes/array/array-pipes.module';
import { FormPipesModule } from 'src/app/pipes/forms/forms.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

@NgModule({
    declarations: [DashboardComponent],
    imports: [
        CommonModule,
        CommonModule,
        ReactiveFormsModule,
        JunteUiModule,
        ArrayPipesModule,
        DashboardRoutingModule,
        FormPipesModule
    ]
})
export class DashboardModule {
}
