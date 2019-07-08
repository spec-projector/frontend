import {NgModule} from '@angular/core';
import {JunteUiModule} from 'junte-ui';
import {RouterModule} from '@angular/router';
import {SpaceManager} from '../services/space-manager.service';
import {CommonModule} from '@angular/common';
import {ImportComponent} from './import.component';

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
