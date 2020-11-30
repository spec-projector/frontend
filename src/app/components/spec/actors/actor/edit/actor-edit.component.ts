import { Component } from '@angular/core';
import { LocalUI } from '../../../../../enums/local-ui';

@Component({
  selector: 'spec-actor-edit',
  templateUrl: './actor-edit.component.html',
  styleUrls: ['./actor-edit.component.scss']
})
export class ActorEditComponent {

  localUi = LocalUI;

}
