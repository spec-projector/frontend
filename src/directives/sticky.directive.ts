import { Directive, ElementRef, Input, NgZone, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import * as assign from 'assign-deep';

interface StickyOption {
  position: number;
  attribute: string;
}

@Directive({
  selector: '[jntSticky]'

})
export class StickyDirective implements OnInit, OnDestroy {

  private listeners: Function[] = [];

  options: StickyOption = {position: 0, attribute: 'data-sticky'};

  @Input('jntSticky')
  set ___options__(options: StickyOption) {
    assign(this.options, options);
  }

  constructor(private hostRef: ElementRef,
              private renderer: Renderer2,
              private zone: NgZone) {
  }

  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      this.listeners.push(this.renderer.listen('document', 'scroll', () => {
        const {attribute} = this.options;
        if (window.scrollY >= this.options.position) {
          this.renderer.setAttribute(this.hostRef.nativeElement, attribute, '');
        } else {
          this.renderer.removeAttribute(this.hostRef.nativeElement, attribute);
        }
      }));
    });
  }

  ngOnDestroy() {
    this.listeners.forEach(listener => listener());
  }

}
