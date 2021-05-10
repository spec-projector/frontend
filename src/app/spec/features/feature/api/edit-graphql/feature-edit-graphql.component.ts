import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModalService, UI } from '@junte/ui';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { Feature } from 'src/models/spec/planning/feature/feature';
import { GraphQL } from 'src/models/spec/planning/feature/graphql';
import { EditMode } from '../../../../../../enums/edit-mode';
import { Spec } from '../../../../../../models/spec/spec';
import { SpecManager } from '../../../../managers';

@Component({
  selector: 'spec-feature-edit-graphql',
  templateUrl: './feature-edit-graphql.component.html',
  styleUrls: ['./feature-edit-graphql.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeatureEditGraphqlComponent implements OnInit, OnDestroy {

  ui = UI;
  editMode = EditMode;

  private _query: GraphQL;
  private subscriptions: {
    query?: Subscription,
    form?: Subscription
  } = {};

  feature: Feature;
  spec: Spec;

  form = this.fb.group({
    title: [null, [Validators.required]],
    text: [null, [Validators.required]]
  });

  set query(query: GraphQL) {
    this._query = query;
    this.updateForm();

    this.subscriptions.query?.unsubscribe();
    this.subscriptions.query = query.replicated$.subscribe(() => this.updateForm());

    this.subscriptions.form?.unsubscribe();
    this.subscriptions.form = this.form.valueChanges
      .subscribe(() => this.form.valid ? this.save() : null);
  }

  get query() {
    return this._query;
  }

  constructor(public manager: SpecManager,
              public modal: ModalService,
              private fb: FormBuilder,
              public cd: ChangeDetectorRef,
              private logger: NGXLogger,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.data.subscribe(({feature, query, spec}) =>
      [this.feature, this.query, this.spec] = [feature, query, spec]);

    this.manager.mode$.subscribe(mode => mode === EditMode.edit
      ? this.form.enable() : this.form.disable());
  }

  ngOnDestroy() {
    [this.subscriptions.query, this.subscriptions.form]
      .forEach(s => s?.unsubscribe());
  }

  updateForm() {
    const {title, text} = this.query;
    this.form.patchValue({title, text}, {emitEvent: false});
    this.cd.markForCheck();
  }

  save() {
    const {title, text} = this.form.getRawValue();
    Object.assign(this.query, {title, text});

    this.manager.put(this.query);
  }

  run() {
    const {text} = this.form.getRawValue();
    open(this.spec.tools.graphqlPlaygroundUrl + '#query=' + encodeURI(text));
  }

}
