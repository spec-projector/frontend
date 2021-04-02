import { Field, Model } from 'serialize-ts';
import { SocialLoginSystem } from '../enums/signin';

@Model()
export class User {

  @Field()
  id: string;

  @Field()
  login: string;
}

@Model()
export class Me extends User {

  @Field()
  email: string;

}
