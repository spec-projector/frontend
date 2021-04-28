import * as assign from 'assign-deep';
import { Field, Model } from 'serialize-ts';
import { IssueSystem } from '../enums/issue';

@Model()
export class IssueDataRequest {

  @Field()
  project: string;

  @Field()
  url: string;

  @Field()
  system: IssueSystem;

  constructor(defs: Partial<IssueDataRequest> = null) {
    if (!!defs) {
      assign(this, defs);
    }
  }

}
