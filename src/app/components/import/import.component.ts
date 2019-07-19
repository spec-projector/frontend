import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UI } from 'junte-ui';
import { characters, generate } from 'shortid';
import { SpaceManager } from 'src/app/services/space-manager.service';

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
        let project = generate().toLowerCase();
        while (!project.match(/^[a-z].*/)) {
            project = generate().toLowerCase();
        }

        this.spaceService.import(project).subscribe(space => {
            console.log('imported');
            console.log(space.id);
            this.router.navigate(['..', 'space', project, space.id]);
        });
    }
}
