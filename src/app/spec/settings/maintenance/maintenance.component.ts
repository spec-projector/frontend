import { Component } from '@angular/core';
import { SpecManager } from '../../managers';

@Component({
  selector: 'spec-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent {

  constructor(private manager: SpecManager) {
  }

  dump(element: HTMLAnchorElement) {
    this.manager.dump()
      .subscribe(dump => {
        const file = new Blob([JSON.stringify(dump, null, 4)],
          {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = 'dump.json';
        element.click();
      });
  }

}
