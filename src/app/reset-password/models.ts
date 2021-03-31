import { Field, Model } from 'serialize-ts';

@Model()
export class SecurityCodeRequest {

  @Field()
  email: string;

  constructor(defs: Partial<SecurityCodeRequest> = {}) {
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
