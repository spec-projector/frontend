import { Injectable } from '@angular/core';
import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
    providedIn: 'root'
})
export class SendCodeGQL extends Mutation<{ ok }> {
    document = gql`
mutation($input: SendPasswordResetSecurityCodeInput!) {
    sendPasswordResetSecurityCode(input: $input) {
        ok
    }
}`;
}

@Injectable({
  providedIn: 'root'
})
export class RestorePasswordGQL extends Mutation<{ resetPassword: { token } }> {
  document = gql`
mutation($input: ResetPasswordInput!) {
    resetPassword(input: $input) {
         token {
            key
            created
        }
    }
}`;
}
