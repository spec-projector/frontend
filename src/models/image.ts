import { Field, Model } from 'serialize-ts';

@Model()
export class Image {

  @Field()
  id: string;

  @Field()
  url: string;
}
