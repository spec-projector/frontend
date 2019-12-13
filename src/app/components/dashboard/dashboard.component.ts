import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UI } from 'junte-ui';
import { AppConfig } from 'src/app/app-config';

@Component({
    selector: 'spec-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
    ui = UI;

    constructor(private router: Router,
                public config: AppConfig) {
    }

    logout() {
        this.config.authorization = null;
        this.router.navigate(['/login']).then(() => null);
    }
}
