import { Injectable } from '@angular/core';
import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordGQL extends Mutation<{ ok }> {
  document = gql`
mutation($input: ChangePasswordInput!) {
    changePassword(input: $input) {
        ok
    }
}`;
}
