import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { JunteUiModule } from 'junte-ui';
import { LoginRoutingModule } from 'src/app/components/login/login-routing.module';
import { LoginComponent } from 'src/app/components/login/login.component';
import { FieldTouchedHasErrorPipe } from 'src/app/components/login/login.pipe';
import { UsersServiceProvider } from 'src/app/services/users/users.provider';

@NgModule({
    declarations: [
        LoginComponent,
        FieldTouchedHasErrorPipe
    ],
    imports: [
        CommonModule,
        JunteUiModule,
        LoginRoutingModule
    ],
    exports: [LoginComponent],
    providers: [UsersServiceProvider]
})
export class LoginModule {
}
