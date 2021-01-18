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

