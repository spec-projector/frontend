import {AfterViewInit, Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {ModalComponent, ModalService, UI} from 'junte-ui';
import {AppConfig} from 'src/app/app-config';
import {MeManager} from 'src/app/managers/me.manager';
import {IUsersService, users_service} from 'src/app/services/users/users.interface';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
    ui = UI;

    @ViewChild('modal', {static: false}) modal: ModalComponent;
    @ViewChild('layout', {read: ElementRef, static: false}) backdrop;

    constructor(@Inject(users_service) private usersService: IUsersService,
                public config: AppConfig,
                private modalService: ModalService,
                private router: Router,
                public me: MeManager) {
    }

    ngAfterViewInit() {
        this.modalService.register(this.modal);
    }

    logout() {
        this.usersService.logout().subscribe(() => {
            this.config.authorization = null;
            this.router.navigate(['/login']).then(() => null);
        });
    }
}
