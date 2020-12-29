import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PopoverInstance, PopoverService, UI } from '@junte/ui';
import { generate as shortid } from 'shortid';
import { SpecManager } from 'src/managers/spec.manager';
import { EditMode } from 'src/enums/edit-mode';
import { Actor } from 'src/model/spec/planning/actor';
import { Spec } from 'src/model/spec/spec';
import { LocalUI } from '../../../enums/local-ui';

@Component({
  selector: 'spec-actors',
  templateUrl: './actors.component.html',
  styleUrls: ['./actors.component.scss']
})
export class ActorsComponent implements OnInit {

  ui = UI;
  localUi = LocalUI;
  editMode = EditMode;

  spec: Spec;
  instance: { popover: PopoverInstance } = {popover: null};

  constructor(public manager: SpecManager,
              public popover: PopoverService,
              public route: ActivatedRoute,
              public router: Router) {
  }

  ngOnInit() {
    this.route.data.subscribe(({spec}) => this.spec = spec);
  }

  addActor() {
    const actor = new Actor({
      id: shortid(),
      name: 'Some person'
    });
    this.spec.actors.unshift(actor);
    actor.linking(this.spec);

    this.manager.put(actor);
    this.manager.put(this.spec);
  }

  deleteActor(index: number) {
    const actor = this.spec.actors[index];
    this.spec.actors.splice(index, 1);
    this.manager.remove(actor);
    this.manager.put(this.spec);
  }

  moveActor(event: CdkDragDrop<Actor[]>) {
    moveItemInArray(this.spec.actors, event.previousIndex, event.currentIndex);
    this.manager.put(this.spec);
  }

  trackActor(index: number, actor: Actor) {
    return !!actor ? actor.id : null;
  }
}
