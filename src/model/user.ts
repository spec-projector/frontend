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

@Model()
export class SendPasswordResetSecurityCodeInput {

  @Field()
  email: string;

  constructor(defs: Partial<SendPasswordResetSecurityCodeInput> = {}) {
    Object.assign(this, defs);
  }

}

@Model()
export class ResetPasswordInput {

  @Field()
  email: string;

  @Field()
  code: string;

  @Field()
  password: string;

  constructor(defs: Partial<ResetPasswordInput> = {}) {
    Object.assign(this, defs);
  }

}

