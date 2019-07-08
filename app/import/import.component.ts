import {Component} from '@angular/core';
import {UI} from 'junte-ui';
import {SpaceManager} from '../services/space-manager.service';
import {Router} from '@angular/router';
import {generate, characters} from 'shortid';

characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

@Component({
    selector: 'app-import',
    templateUrl: './import.component.html',
    styleUrls: ['./import.component.scss']
})
export class ImportComponent {
    ui = UI;

    constructor(private spaceService: SpaceManager,
                private router: Router) {
    }

    import() {
        const project = generate().toLowerCase();
        this.spaceService.import(project)
            .subscribe(space => {
                console.log('imported');
                console.log(space.id);
                this.router.navigate(['..', 'space', project, space.id]);
            });
    }
}
