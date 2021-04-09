import { Field, Model } from 'serialize-ts';

@Model()
export class ChangeSubscription {

  @Field()
  tariff: string;

  @Field()
  hash: string;

  constructor(defs: Partial<ChangeSubscription> = {}) {
    Object.assign(this, defs);
  }

}
