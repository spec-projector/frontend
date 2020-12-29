import { Field, Model } from 'serialize-ts';

@Model()
export class Authorization {

  @Field()
  created: string;

  @Field()
  key: string;

}
