import { Field, Model } from 'serialize-ts';
import assign from 'assign-deep';
import { FileSerializer } from '../serializers/file';

@Model()
export class UploadMeAvatarInput {

  @Field()
  user: number;

  @Field({serializer: new FileSerializer()})
  file: File;

  @Field()
  left: number;

  @Field()
  top: number;

  @Field()
  width: number;

  @Field()
  height: number;

  @Field()
  scale: number;

  constructor(defs: Partial<UploadMeAvatarInput> = null) {
    assign(this, defs);
  }

}
