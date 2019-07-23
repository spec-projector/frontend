import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JunteUiModule } from 'junte-ui';
import { SpecManager } from 'src/app/managers/spec.manager';
import { ImportComponent } from 'src/app/components/import/import.component';

@NgModule({
    declarations: [
        ImportComponent
    ],
    imports: [
        CommonModule,
        JunteUiModule,
        RouterModule.forChild([
            {
                path: '',
                component: ImportComponent
            }
        ])
    ],
    providers: [
        SpecManager
    ]
})
export class ImportModule {
}
