import { Field, Model } from 'serialize-ts';
import { Tariff } from './tariffs';

@Model()
export class Subscription {

  @Field()
  tariff: Tariff;

}

