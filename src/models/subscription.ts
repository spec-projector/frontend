import { DateSerializer, Field, Model } from 'serialize-ts';
import { Tariff } from './tariffs';

@Model()
export class Subscription {

  @Field()
  tariff: Tariff;

}

@Model()
export class ChangeSubscriptionRequest {

  @Field()
  createdAt: Date;

  @Field()
  tariff: Tariff;

}
