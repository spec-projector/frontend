import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UI } from '@junte/ui';
import { Subscription } from 'rxjs';
import { EditMode } from 'src/enums/edit-mode';
import { SpecManager } from 'src/app/spec/managers/spec';
import { Sprint } from 'src/models/spec/planning/sprint';
import { LocalUI } from '../../../../enums/local-ui';
import { Feature } from '../../../../models/spec/planning/feature/feature';
import { trackElement } from '../../../../utils/templates';

@Component({
  selector: 'spec-sprint',
  templateUrl: './sprint.component.html',
  styleUrls: ['./sprint.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SprintComponent implements AfterViewInit, OnDestroy {

  ui = UI;
  localUi = LocalUI;
  editMode = EditMode;
  trackElement = trackElement;

  private _sprint: Sprint;
  private subscriptions: {
    actor?: Subscription,
    form?: Subscription
  } = {};
  version = 0;

  @Input()
  mode = EditMode.view;

  @Output()
  updated = new EventEmitter<Sprint>();

  form = this.fb.group({
    title: [null]
  });

  @Input()
  set sprint(sprint: Sprint) {
    this._sprint = sprint;
    this.updateForm();

    this.subscriptions.actor?.unsubscribe();
    this.subscriptions.actor = sprint.replicated$.subscribe(() => this.updateForm());

    this.subscriptions.form?.unsubscribe();
    this.subscriptions.form = this.form.valueChanges
      .subscribe(() => {
        const {title} = this.form.getRawValue();
        this.sprint.title = title;
        this.manager.put(this.sprint);

        this.cd.detectChanges();
      });
  }

  get sprint() {
    return this._sprint;
  }

  @ViewChild('titleRef')
  titleRef: ElementRef<HTMLInputElement>;

  constructor(public manager: SpecManager,
              private fb: FormBuilder,
              private cd: ChangeDetectorRef,
              public route: ActivatedRoute,
              public router: Router) {

  }

  ngAfterViewInit() {
    if (!!this.titleRef) {
      this.titleRef.nativeElement.focus();
    }
  }

  ngOnDestroy() {
    [this.subscriptions.actor, this.subscriptions.form]
      .forEach(s => s?.unsubscribe());
  }

  private updateForm() {
    this.form.patchValue({
      title: this.sprint.title
    });
  }

  onDropFromLibrary({item: {data}}: CdkDragDrop<{ id: string }[]>) {
    if (data instanceof Feature) {
      this.attachFeature(data);
    }

    this.version++;
    this.cd.detectChanges();

    this.updated.emit(this.sprint);
  }

  attachFeature(feature: Feature) {
    if (!!feature.sprint) {
      const index = feature.sprint.features.indexOf(feature);
      feature.sprint.features.splice(index, 1);
      this.manager.put(feature.sprint);
    }
    this.sprint.features.push(feature);
    feature.linking({sprint: this.sprint});
    this.manager.put(this.sprint);
  }

  deleteFeature(feature: Feature) {
    const index = this.sprint.features.indexOf(feature);
    this.sprint.features.splice(index, 1);
    this.manager.put(this.sprint);

    feature.sprint = null;

    this.version++;
    this.cd.detectChanges();

    this.updated.emit(this.sprint);
  }

  moveFeature(event: CdkDragDrop<Feature[]>) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    this.manager.put(this.sprint);

    this.version++;
    this.cd.detectChanges();
  }

}
