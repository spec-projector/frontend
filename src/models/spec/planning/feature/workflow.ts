import { persist, persistence } from '../../../../decorators/persistence';

export enum WorkflowStepState {
  doing = 'doing',
  done = 'done',
  missed = 'missed'
}

@persistence()
export class Workflow {

  @persist()
  story: WorkflowStepState = WorkflowStepState.doing;

  @persist()
  design: WorkflowStepState = WorkflowStepState.doing;

  @persist()
  resources: WorkflowStepState = WorkflowStepState.doing;

  @persist()
  api: WorkflowStepState = WorkflowStepState.doing;

  @persist()
  developing: WorkflowStepState = WorkflowStepState.doing;

  @persist()
  testing: WorkflowStepState = WorkflowStepState.doing;

  @persist()
  accepting: WorkflowStepState = WorkflowStepState.doing;

  constructor(defs: any = {}) {
    Object.assign(this, defs);
  }
}
