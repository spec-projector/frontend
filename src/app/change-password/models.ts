import { Field, Model } from 'serialize-ts';

@Model()
export class ChangePasswordInput {

  @Field()
  password: string;

  constructor(defs: Partial<ChangePasswordInput> = {}) {
    Object.assign(this, defs);
  }

}
