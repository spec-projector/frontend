import { Injectable } from '@angular/core';
import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class LoginGQL extends Mutation<{ login: { token } }> {
  document = gql`
mutation Login($input: LoginInput!) {
  response: login(input: $input) {
    token {
      key
      created
      user {
        id
        lastLogin
        firstName
        lastName
        email
      }
    }
  }
}`;
}

@Injectable({
  providedIn: 'root'
})
export class SocialLoginGQL extends Mutation<{ response }> {
  document = gql`
mutation ($system: SystemBackend!) {
  response: socialLogin(system: $system) {
    redirectUrl
  }
}`;
}

@Injectable({
  providedIn: 'root'
})
export class SocialLoginCompleteGQL extends Mutation<{ response: { token } }> {
  document = gql`
mutation ($system: SystemBackend!, $code: String!, $state: String!) {
  response: socialLoginComplete(system: $system, code: $code, state: $state) {
    token {
      key
    }
  }
}`;
}
