import {Field} from 'serialize-ts';

export class Authorization {
  @Field()
  token: string;

  @Field()
  type: string;
}
