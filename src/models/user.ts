import { Field, Model } from 'serialize-ts';
import { ChangeSubscriptionRequest, Subscription } from './subscription';

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
  changeSubscriptionRequest: ChangeSubscriptionRequest;

  @Field()
  email: string;

}

@Model()
export class UpdateMeInput {

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  file: string;

  constructor(defs: Partial<UpdateMeInput> = {}) {
    Object.assign(this, defs);
  }

}
