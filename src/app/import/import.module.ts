import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JunteUiModule } from 'junte-ui';
import { SpaceManager } from '../services/space-manager.service';
import { ImportComponent } from './import.component';

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
        SpaceManager
    ]
})
export class ImportModule {
}