import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UI } from '@junte/ui';
import { merge, Subscription } from 'rxjs';
import { EditMode } from 'src/enums/edit-mode';
import { SpecManager } from 'src/app/spec/managers/spec';
import { Term } from 'src/models/spec/planning/term';
import { Token } from 'src/models/spec/planning/token';

class TermEditMode {
  title: EditMode;
  description: EditMode;
}

@Component({
  selector: 'spec-term',
  templateUrl: './term.component.html',
  styleUrls: ['./term.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TermComponent implements AfterViewInit, OnDestroy {

  ui = UI;
  editMode = EditMode;

  private _term: Term;
  private subscriptions: {
    term?: Subscription,
    form?: Subscription
  } = {};
  private _mode: TermEditMode = {
    title: EditMode.view,
    description: EditMode.view
  };

  @Input()
  set mode(mode: Partial<TermEditMode>) {
    Object.assign(this._mode, mode);
  }

  get mode() {
    return this._mode;
  }

  form = this.fb.group({
    title: [null],
    description: [null]
  });

  @Input()
  set term(term: Term) {
    this._term = term;
    this.updateForm();

    this.subscriptions.term?.unsubscribe();
    this.subscriptions.term = merge(term.replicated$, term.updated$)
      .subscribe(() => this.updateForm());

    this.subscriptions.form?.unsubscribe();
    this.subscriptions.form = this.form.valueChanges
      .subscribe(() => {
        const {title, description} = this.form.getRawValue();
        Object.assign(this.term, {title, description: Token.parse(description.trim())});
        this.manager.put(this.term);

        this.cd.detectChanges();
      });
  }

  get term() {
    return this._term;
  }

  @ViewChild('titleRef')
  titleRef: ElementRef<HTMLInputElement>;

  constructor(private fb: FormBuilder,
              private cd: ChangeDetectorRef,
              public manager: SpecManager) {
  }

  ngAfterViewInit() {
    if (!!this.titleRef) {
      this.titleRef.nativeElement.focus();
    }
  }

  ngOnDestroy() {
    [this.subscriptions.term, this.subscriptions.form]
      .forEach(s => s?.unsubscribe());
  }

  private updateForm() {
    const {title, description} = this.term;
    this.form.patchValue({
      title: title,
      description: description.map(t => t.toString()).join(' ')
    }, {emitEvent: false});
    this.cd.markForCheck();
  }

}
