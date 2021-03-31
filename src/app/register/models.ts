import { Field, Model } from 'serialize-ts';

@Model()
export class UserRegister {

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  login: string;

  @Field()
  password: string;

  constructor(defs: Partial<UserRegister> = {}) {
    Object.assign(this, defs);
  }
}
