import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Spec } from '../../../../models/spec/spec';
import { SpecManager } from '../../managers';
import { StaffManager } from './managers';

@Component({
  selector: 'spec-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss'],
  providers: [
    {provide: StaffManager, deps: [SpecManager]}
  ]
})
export class StaffComponent implements OnInit {

  spec: Spec;

  constructor(private staff: StaffManager,
              public manager: SpecManager,
              public route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.data.subscribe(({spec, me}) => this.spec = spec);
  }

  fillDemo() {
    this.staff.fillDemo(this.spec);
  }

}
