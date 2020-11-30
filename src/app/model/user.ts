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
