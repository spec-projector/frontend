import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { Feature } from 'src/app/model/spec/planning/feature';
import { TokenType } from 'src/app/model/spec/planning/token';

@Component({
  selector: 'spec-feature-markdown',
  templateUrl: './feature-markdown.component.html',
  styleUrls: ['./feature-markdown.component.scss']
})
export class FeatureMarkdownComponent {

  tokenType = TokenType;

  @ViewChild('summary', {static: false, read: ElementRef})
  summary: ElementRef<HTMLElement>;

  @Input()
  feature: Feature;

  constructor(private clipboard: ClipboardService) {

  }

  copy() {
    const summary = this.summary.nativeElement.innerText;
    this.clipboard.copyFromContent(summary);
  }
}
