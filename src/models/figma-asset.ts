import * as assign from 'assign-deep';
import { Field, Model } from 'serialize-ts';

@Model()
export class UploadFigmaAssetRequest {

  @Field()
  project: string;

  @Field()
  url: string;

  constructor(defs: Partial<UploadFigmaAssetRequest> = null) {
    if (!!defs) {
      assign(this, defs);
    }
  }

}
