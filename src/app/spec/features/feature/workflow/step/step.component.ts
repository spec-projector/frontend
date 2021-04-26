import {ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, HostListener} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {NGXLogger} from 'ngx-logger';
import {WorkflowStepState} from '../../../../../../models/spec/planning/feature';
import {UI} from '@junte/ui';

@Component({
  selector: 'spec-workflow-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WorkflowStepComponent),
      multi: true
    }
  ]

})
export class WorkflowStepComponent {

  ui = UI;
  workflowStepState = WorkflowStepState;

  disabled = false;
  state = WorkflowStepState.progress;

  onChange: (value: WorkflowStepState) => void = () => this.logger.error('value accessor is not registered');
  onTouched: () => void = () => this.logger.error('value accessor is not registered');
  registerOnChange = fn => this.onChange = fn;
  registerOnTouched = fn => this.onTouched = fn;
  @HostListener('blur') onBlur = () => this.onTouched();

  constructor(private cd: ChangeDetectorRef,
              private logger: NGXLogger) {
  }

  writeValue(state: WorkflowStepState) {
    this.state = state;
    this.cd.markForCheck();
  }

  next() {
    switch (this.state) {
      case WorkflowStepState.progress:
        this.state = WorkflowStepState.done;
        break;
      case WorkflowStepState.done:
        this.state = WorkflowStepState.exclude;
        break;
      case WorkflowStepState.exclude:
      default:
        this.state = WorkflowStepState.progress;
    }

    this.onChange(this.state);
    this.cd.detectChanges();
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }


}
