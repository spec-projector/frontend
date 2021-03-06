import { persist, Persistence, persistence } from '../../../../decorators/persistence';
import { ModelType } from '../../../enums';
import * as assign from 'assign-deep';

export enum WorkflowStepState {
  doing = 'doing',
  done = 'done',
  missed = 'missed'
}

@persistence()
export class FeatureWorkflow extends Persistence {

  @persist({name: 'model_type'})
  modelType: string = ModelType.featureWorkflow;

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

  constructor(defs: Partial<FeatureWorkflow> = {}) {
    super();
    assign(this, defs);
  }

}
