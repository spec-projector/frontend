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
import { Subscription } from 'rxjs';
import { SpecManager } from 'src/app/spec/managers/spec';
import { EditMode } from 'src/enums/edit-mode';
import { Term } from 'src/models/spec/planning/term';
import { Token } from 'src/models/spec/planning/token';

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
  private _mode: EditMode = EditMode.view;
  private subscriptions: {
    term?: Subscription,
    form?: Subscription
  } = {};

  @Input()
  set mode(mode: EditMode) {
    this._mode = mode;
    this.cd.detectChanges();
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
    this.subscriptions.term = term.replicated$
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
    this.cd.detach();
  }

  ngAfterViewInit() {
    this.titleRef?.nativeElement.focus();
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

    this.cd.detectChanges();
  }

}
