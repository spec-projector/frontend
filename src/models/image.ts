import { Field, Model } from 'serialize-ts';
import { FileSerializer } from '../serializers/file';
import * as assign from 'assign-deep';

@Model()
export class Image {

  @Field()
  id: string;

  @Field()
  url: string;
}

@Model()
export class UploadImageInput {

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

  constructor(defs: Partial<UploadImageInput> = null) {
    assign(this, defs);
  }

}
