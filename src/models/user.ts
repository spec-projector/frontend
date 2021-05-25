import { Field, Model } from 'serialize-ts';
import { Image } from './image';
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
  avatar: Image;
}

@Model()
export class MeUser extends User {

  @Field()
  subscription: Subscription;

  @Field()
  changeSubscriptionRequest: ChangeSubscriptionRequest;

  @Field()
  email: string;

  @Field()
  isStaff: boolean;

}

@Model()
export class UpdateMeInput {

  @Field()
  avatar: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  constructor(defs: Partial<UpdateMeInput> = {}) {
    Object.assign(this, defs);
  }

}
