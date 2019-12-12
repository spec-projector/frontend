import { field, model } from '@junte/mocker-library';

@model()
export class User {

    @field({mock: '{{int 0 100}}'})
    id: string;

    @field({mock: '{{login}}'})
    login: string;
}

@model()
export class Me extends User {

}
