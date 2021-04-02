import { Field, Model } from 'serialize-ts';

@Model()
export class UserRegister {

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  password: string;

  constructor(defs: Partial<UserRegister> = {}) {
    Object.assign(this, defs);
  }
}
