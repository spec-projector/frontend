import { AfterViewInit, Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[fitHeight]'
})
export class FitHeightDirective implements AfterViewInit {

  constructor(private hostRef: ElementRef<HTMLTextAreaElement>,
              private renderer: Renderer2) {
  }

  ngAfterViewInit() {
    this.updateHeight();
  }

  @HostListener('input')
  onInput() {
    this.updateHeight();
  }

  private updateHeight() {
    const {nativeElement: e} = this.hostRef;
    this.renderer.setStyle(e, 'min-height', `${e.scrollHeight}px`);
  }

}
