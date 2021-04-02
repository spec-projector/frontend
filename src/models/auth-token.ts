import { Field, Model } from 'serialize-ts';

@Model()
export class AuthToken {

  @Field()
  created: string;

  @Field()
  key: string;

}
