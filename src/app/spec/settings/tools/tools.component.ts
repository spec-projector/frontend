import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Spec } from '../../../../models/spec/spec';
import { DemoManager, FillMode } from '../../managers/demo';
import { SpecManager } from '../../managers/spec';

@Component({
  selector: 'spec-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss']
})
export class ToolsComponent implements OnInit {

  fillMode = FillMode;

  spec: Spec;

  constructor(private demo: DemoManager,
              public manager: SpecManager,
              public route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.data.subscribe(({spec}) => this.spec = spec);
  }

  fill(mode: FillMode = FillMode.full) {
    const {changed, deleted} = this.demo.fill(this.spec, mode);
    changed.forEach(o => this.manager.put(o));
    deleted.forEach(o => this.manager.remove(o));
  }

}
