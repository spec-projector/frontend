import { field } from '@junte/mocker-library';

export class Authorization {
    @field()
    created: string;

    @field()
    key: string;
}
