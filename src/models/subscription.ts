import { DateSerializer, Field, Model } from 'serialize-ts';
import { Tariff } from './tariffs';

@Model()
export class Subscription {

  @Field()
  id: number;

  @Field()
  createdAt: Date;

  @Field()
  tariff: Tariff;

  @Field({serializer: new DateSerializer()})
  activeUntil: Date;

}

@Model()
export class ChangeSubscriptionRequest {

  @Field()
  createdAt: Date;

  @Field()
  tariff: Tariff;

  @Field()
  toSubscription: Subscription;

}
