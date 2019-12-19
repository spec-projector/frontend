import { Component, ElementRef, Input } from '@angular/core';
import { Feature } from 'src/app/model/spec/planning/feature';
import { TokenType } from 'src/app/model/spec/planning/token';

@Component({
    selector: 'spec-feature-markdown',
    templateUrl: './feature-markdown.component.html',
    styleUrls: ['./feature-markdown.component.scss']
})
export class FeatureMarkdownComponent {

    tokenType = TokenType;

    @Input()
    feature: Feature;

    constructor(private hostRef: ElementRef) {

    }

    getMarkdown() {
        return this.hostRef.nativeElement.innerHTML
            .replace(/\n/g, '')
            .replace(/<br[^>]*>/g, '\r\n')
            .replace(/<\/?[^>]+(>|$)/g, '');
    }
}
