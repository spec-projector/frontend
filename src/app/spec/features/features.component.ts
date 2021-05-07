import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'spec-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeaturesComponent {

}
