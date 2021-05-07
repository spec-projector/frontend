import { persist, Persistence, persistence } from 'src/decorators/persistence';
import { IssueState, IssueSystem } from 'src/enums/issue';
import { ModelType } from '../../../enums';
import * as assign from 'assign-deep';

@persistence()
export class Developer {

  @persist()
  name: string;

  @persist()
  avatar: string;
}

@persistence()
export class Issue extends Persistence {

  @persist({name: 'model_type'})
  modelType: string = ModelType.featureIssue;

  @persist()
  resource: string;

  @persist()
  url: string;

  @persist()
  system: IssueSystem;

  @persist()
  title: string;

  @persist()
  assignee: Developer;

  @persist()
  spent: number;

  @persist()
  error: string;

  @persist()
  state: IssueState;

  constructor(defs: Partial<Issue> = {}) {
    super();
    assign(this, defs);
  }
}
