import { field, model } from '@junte/mocker-library';
import { ArraySerializer, PrimitiveSerializer } from 'serialize-ts/dist';

export enum UserPermission {
    inviteUser = 'invite_user',
}

@model()
export class User {

    @field({mock: '{{int 0 100}}'})
    id: string;

    @field({mock: '{{login}}'})
    login: string;
}

@model()
export class Me extends User {

    @field({
        serializer: new ArraySerializer(new PrimitiveSerializer()),
        mock: [UserPermission.inviteUser]
    })
    permissions: UserPermission[];

}
