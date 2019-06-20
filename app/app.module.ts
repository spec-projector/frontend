import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {JunteUiModule} from 'junte-ui';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        JunteUiModule,
        RouterModule.forRoot([
                {
                    path: 'space',
                    loadChildren: './space/space.module#SpaceModule'
                },
                {
                    path: 'import',
                    loadChildren: './import/import.module#ImportModule'
                }
            ], {
                paramsInheritanceStrategy: 'always',
                relativeLinkResolution: 'corrected'
            }
        )
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
