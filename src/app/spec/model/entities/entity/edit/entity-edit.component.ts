import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Entity } from '../../../../../../models/spec/orm/entity';

@Component({
  selector: 'spec-entity-edit',
  templateUrl: './entity-edit.component.html',
  styleUrls: ['./entity-edit.component.scss']
})
export class EntityEditComponent implements OnInit {

  entity: Entity;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.data.subscribe(({entity}) => this.entity = entity);
  }

}
