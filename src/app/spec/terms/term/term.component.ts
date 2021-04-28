import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UI } from '@junte/ui';
import { Subscription } from 'rxjs';
import { EditMode } from 'src/enums/edit-mode';
import { SpecManager } from 'src/app/spec/managers';
import { Term } from 'src/models/spec/planning/term';
import { Token } from 'src/models/spec/planning/token';

class TermEditMode {
  name: EditMode;
  description: EditMode;
}

@Component({
  selector: 'spec-term',
  templateUrl: './term.component.html',
  styleUrls: ['./term.component.scss']
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
    name: EditMode.view,
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
    name: [null],
    description: [null]
  });

  @Input()
  set term(term: Term) {
    this._term = term;
    this.updateForm();

    this.subscriptions.term?.unsubscribe();
    this.subscriptions.term = term.changes.subscribe(() => this.updateForm());

    this.subscriptions.form?.unsubscribe();
    this.subscriptions.form = this.form.valueChanges
      .subscribe(() => {
        const {name, description} = this.form.getRawValue();
        [this.term.name, this.term.description] = [name, Token.parse(description.trim())];
        this.manager.put(this.term);

        this.cd.detectChanges();
      });
  }

  get term() {
    return this._term;
  }

  @ViewChild('nameRef')
  nameRef: ElementRef<HTMLInputElement>;

  constructor(private fb: FormBuilder,
              private cd: ChangeDetectorRef,
              public manager: SpecManager) {
  }

  ngAfterViewInit() {
    if (!!this.nameRef) {
      this.nameRef.nativeElement.focus();
    }
  }

  ngOnDestroy() {
    [this.subscriptions.term, this.subscriptions.form]
      .forEach(s => s?.unsubscribe());
  }

  private updateForm() {
    const {name, description} = this.term;
    this.form.patchValue({
      name,
      description: description.map(t => t.toString()).join(' ')
    });
  }

}
