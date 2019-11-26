import { AfterViewInit, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalComponent, ModalService, PopoverComponent, PopoverService, UI } from 'junte-ui';
import { AppConfig } from 'src/app/app-config';
import { MeManager } from 'src/app/managers/me.manager';
import { IUsersService, users_service } from 'src/app/services/users/users.interface';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
    ui = UI;

    @ViewChild('popover', {static: false}) popover: PopoverComponent;
    @ViewChild('modal', {static: false}) modal: ModalComponent;
    @ViewChild('layout', {read: ElementRef, static: true}) backdrop;

    constructor(@Inject(users_service) private usersService: IUsersService,
                public config: AppConfig,
                private modalService: ModalService,
                private popoverService: PopoverService,
                private router: Router) {
    }

    ngAfterViewInit() {
        this.modalService.register(this.modal);
        this.popoverService.register(this.popover);
    }

    logout() {
        this.usersService.logout().subscribe(() => {
            this.config.authorization = null;
            this.router.navigate(['/login']).then(() => null);
        });
    }
}
