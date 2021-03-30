import { Field, Model } from 'serialize-ts';
import { SocialLoginSystem } from '../enums/signin';

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
export class SocialLoginRequest {

  @Field()
  system: SocialLoginSystem;

  constructor(defs: Partial<SocialLoginRequest> = {}) {
    Object.assign(this, defs);
  }

}

@Model()
export class MakeSocialLogin {

  @Field()
  redirectUrl: string;

  constructor(defs: Partial<MakeSocialLogin> = {}) {
    Object.assign(this, defs);
  }

}

@Model()
export class CompleteSocialLoginRequest {

  @Field()
  system: SocialLoginSystem;

  @Field()
  state: string;

  @Field()
  code: string;

  constructor(defs: Partial<CompleteSocialLoginRequest> = {}) {
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
