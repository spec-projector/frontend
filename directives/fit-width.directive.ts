import {AfterViewInit, Directive, ElementRef, HostListener, Input, Renderer2} from '@angular/core';

const MIN_WIDTH = 30;
const SHIFT = 30;

@Directive({
    selector: '[fitWidth]'
})
export class FitWidthDirective implements AfterViewInit {

    private readonly host: HTMLInputElement;
    private measure: HTMLDivElement;

    constructor(host: ElementRef,
                private renderer: Renderer2) {
        this.host = host.nativeElement;
    }

    ngAfterViewInit() {
        this.measure = this.renderer.createElement('div');
        this.renderer.setStyle(this.measure, 'position', 'absolute');
        this.renderer.setStyle(this.measure, 'visibility', 'hidden');
        this.renderer.setStyle(this.measure, 'height', '0');
        this.renderer.setStyle(this.measure, 'whiteSpace', 'pre');
        this.renderer.setStyle(this.measure, 'fontFamily', this.host.style.fontFamily);
        this.renderer.appendChild(this.host.parentElement, this.measure);
        this.updateWidth();
    }

    @HostListener('keyup') changed() {
        this.updateWidth();
    }

    private updateWidth() {
        this.measure.innerHTML = this.host.value;

        const style = getComputedStyle(this.host, null);
        this.renderer.setStyle(this.measure, 'fontSize', style.getPropertyValue('font-size'));
        this.renderer.setStyle(this.measure, 'padding', style.getPropertyValue('padding'));
        this.renderer.setStyle(this.measure, 'fontWeight', style.getPropertyValue('font-weight'));

        const width = Math.max(MIN_WIDTH, this.measure.offsetWidth) + SHIFT;
        this.renderer.setStyle(this.host, 'maxWidth', `${width}px`);
        this.renderer.setStyle(this.host, 'width', `${width}px`);
    }
}
