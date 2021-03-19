import { Field, Model } from 'serialize-ts';

@Model()
export class User {

  @Field()
  id: string;

  @Field()
  login: string;
}

@Model()
export class Me extends User {

}

@Model()
export class UserCredentials {

  @Field()
  login: string;

  @Field()
  password: string;

  constructor(defs: Partial<UserCredentials> = {}) {
    Object.assign(this, defs);
  }
}

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

