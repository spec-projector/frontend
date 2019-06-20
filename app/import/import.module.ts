import {NgModule} from '@angular/core';
import {JunteUiModule} from 'junte-ui';
import {RouterModule} from '@angular/router';
import {SpaceService} from '../services/space.service';
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
        SpaceService
    ]
})
export class ImportModule {
}
