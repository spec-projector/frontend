import {Component, Input} from '@angular/core';
import {Feature} from '../../../model/planning/feature';
import {UI} from 'junte-ui';
import {FramesStorage} from '../../services/frames-storage.service';
import * as Figma from 'figma-api';
import {ClipboardService} from 'ngx-clipboard';
import {TokenType} from '../../../model/planning/token';
import {SpaceService} from "../../services/space.service";

@Component({
    selector: 'app-feature',
    templateUrl: './feature.component.html',
    styleUrls: ['./feature.component.scss']
})
export class FeatureComponent {

    ui = UI;
    tokenType = TokenType;

    copied = false;

    @Input() feature: Feature;

    figma = new Figma.Api({
        personalAccessToken: '12129-3a0f1d4d-ba86-4364-a226-954bd1c40120'
    });

    constructor(private space: SpaceService,
                private clipboard: ClipboardService,
                public storage: FramesStorage) {

    }

    preview(file: string, node: string) {
        this.storage.set(file, node);

        this.figma.getImage(file, {ids: node, scale: 1.5, format: 'png'})
            .then(res => {
                if (!!res.images) {
                    this.storage.set(file, node, res.images.images[node]);
                }
            });
    }

    goto(url: string) {
        open(url);
    }

    markdown(container: HTMLElement) {
        container.style.display = 'block';
        this.clipboard.copyFromContent(container.innerText);
        this.copied = true;
    }

}
