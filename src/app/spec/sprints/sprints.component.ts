import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalService, UI } from '@junte/ui';
import { generate as shortid } from 'shortid';
import { EditMode } from 'src/enums/edit-mode';
import { Language } from 'src/enums/language';
import { SpecManager } from 'src/app/spec/managers';
import { Sprint } from 'src/models/spec/planning/sprint';
import { Spec } from 'src/models/spec/spec';
import { CURRENT_LANGUAGE } from '../../../consts';
import { LocalUI } from '../../../enums/local-ui';
import { trackElement } from '../../../utils/templates';

@Component({
  selector: 'spec-sprints',
  templateUrl: './sprints.component.html',
  styleUrls: ['./sprints.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SprintsComponent implements OnInit {

  ui = UI;
  language = Language;
  localUi = LocalUI;
  editMode = EditMode;
  trackElement = trackElement;
  consts = {language: CURRENT_LANGUAGE};

  spec: Spec;
  version = 0;
  added: string;

  constructor(public manager: SpecManager,
              public modal: ModalService,
              public cd: ChangeDetectorRef,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.data.subscribe(({spec}) => this.spec = spec);
  }

  addSprint() {
    const sprint = new Sprint({
      id: shortid(),
      title: $localize`:@@label.new_sprint_title:Key features`
    });
    this.spec.sprints.push(sprint);
    sprint.linking(this.spec);

    this.manager.put(sprint);
    this.manager.put(this.spec);

    this.added = sprint.id;
    this.version++;
    this.cd.detectChanges();
  }

  deleteSprint(sprint: Sprint) {
    const links = sprint.delete();
    links.deleted.forEach(o => this.manager.remove(o));
    links.changed.forEach(o => this.manager.put(o));
    this.manager.remove(sprint);

    this.version++;
    this.cd.detectChanges();
    this.modal.close();
  }

  moveSprint(event: CdkDragDrop<Sprint[]>) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    this.manager.put(this.spec);

    this.version++;
    this.cd.detectChanges();
  }

}
