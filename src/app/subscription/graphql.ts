import { Injectable } from '@angular/core';
import { Mutation, Query } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class ChangeSubscriptionGQL extends Mutation<{ response: { request } }> {
  document = gql`
mutation ($input: ChangeSubscriptionInput!) {
  response: changeSubscription(input: $input) {
    request {
      createdAt
      tariff {
        title
      }
    }
  }
}
`;
}

@Injectable({providedIn: 'root'})
export class CheckSubscriptionGQL extends Query<{ me }> {
  document = gql`
query Me {
  me {
    subscription {
      id
      tariff {
        id
        title
        icon
        price
      }
      activeUntil
    }
    changeSubscriptionRequest {
      createdAt
      tariff {
        title
      }
      toSubscription {
        id
      }
    }
  }
}`;
}
