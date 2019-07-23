import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormPipesModule } from 'junte-angular';
import { JunteUiModule } from 'junte-ui';
import { LoginRoutingModule } from 'src/app/components/login/login-routing.module';
import { LoginComponent } from 'src/app/components/login/login.component';
import { UsersServiceProvider } from 'src/app/services/users/users.provider';

@NgModule({
    declarations: [
        LoginComponent
    ],
    imports: [
        CommonModule,
        JunteUiModule,
        LoginRoutingModule,
        FormPipesModule
    ],
    providers: [UsersServiceProvider]
})
export class LoginModule {
}
