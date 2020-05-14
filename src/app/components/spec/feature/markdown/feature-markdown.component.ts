import { AfterContentChecked, AfterContentInit, AfterViewChecked, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { Feature } from 'src/app/model/spec/planning/feature';
import { TokenType } from 'src/app/model/spec/planning/token';

@Component({
  selector: 'spec-feature-markdown',
  templateUrl: './feature-markdown.component.html',
  styleUrls: ['./feature-markdown.component.scss']
})
export class FeatureMarkdownComponent implements AfterViewChecked {

  tokenType = TokenType;

  @ViewChild('raw', {static: false, read: ElementRef})
  raw: ElementRef<HTMLElement>;

  @ViewChild('markdown', {static: false, read: ElementRef})
  markdown: ElementRef<HTMLElement>;

  @Input()
  feature: Feature;

  constructor(private clipboard: ClipboardService) {

  }

  ngAfterViewChecked() {
    this.markdown.nativeElement.innerHTML = this.raw.nativeElement.innerText;
  }

  copy() {
    this.clipboard.copy(this.raw.nativeElement.innerText);
  }
}
