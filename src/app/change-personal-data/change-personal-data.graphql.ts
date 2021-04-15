import { Injectable } from '@angular/core';
import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class UploadMeAvatarGQL extends Mutation<{ response }> {
  document = gql`
mutation($input: UploadMeAvatarInput!) {
    response: uploadMeAvatar(input: $input) {
        user {
          id
          avatar
        }
    }
}`;
}

@Injectable({
  providedIn: 'root'
})
export class UpdateMeGQL extends Mutation<{ response }> {
  document = gql`
mutation($input: UpdateMeInput!) {
    response: updateMe(input: $input) {
        me {
            firstName
            lastName
        }
    }
}`;
}
