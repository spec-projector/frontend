import { Field, Model } from 'serialize-ts';
import { Subscription } from './subscription';

@Model()
export class User {

  @Field()
  id: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  avatar: string;
}

@Model()
export class MeUser extends User {

  @Field()
  subscription: Subscription;

  @Field()
  email: string;

}
