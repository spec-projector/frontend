import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PopoverInstance, UI } from '@junte/ui';
import { SpecManager } from 'src/managers/spec.manager';
import { EditMode } from 'src/enums/edit-mode';
import { Epic } from 'src/model/spec/planning/epic';
import { Spec } from 'src/model/spec/spec';
import * as uuid from 'uuid/v1';
import { LocalUI } from '../../../enums/local-ui';
import { Actor } from '../../../model/spec/planning/actor';

@Component({
  selector: 'spec-epics',
  templateUrl: './epics.component.html',
  styleUrls: ['./epics.component.scss']
})
export class EpicsComponent implements OnInit {

  ui = UI;
  localUi = LocalUI;
  editMode = EditMode;

  spec: Spec;
  instance: { popover: PopoverInstance } = {popover: null};

  constructor(public manager: SpecManager,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.data.subscribe(({spec}) => this.spec = spec);
  }

  addEpic() {
    const epic = new Epic({
      id: uuid(),
      title: 'Some functionality'
    });
    this.spec.epics.unshift(epic);

    this.manager.put(epic);
    this.manager.put(this.spec);
  }

  deleteEpic(index: number) {
    const epic = this.spec.epics[index];
    epic.features.forEach(f => {
      f.linking({epic: null});
      this.manager.put(f);
    });


    this.manager.remove(epic);
    this.spec.epics.splice(index, 1);
    this.manager.put(this.spec);
  }

  moveEpic(event: CdkDragDrop<Epic[]>) {
    moveItemInArray(this.spec.epics, event.previousIndex, event.currentIndex);
    this.manager.put(this.spec);
  }

  trackEpic(index: number, epic: Epic) {
    return !!epic ? epic.id : null;
  }

}
