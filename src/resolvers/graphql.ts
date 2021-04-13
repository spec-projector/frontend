import { Injectable } from '@angular/core';
import { Query } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({providedIn: 'root'})
export class MeGQL extends Query<{ me }> {
  document = gql`
query Me {
  me {
    id
    lastLogin
    firstName
    lastName
    email
    isStaff
    isActive
    subscription {
      id
      createdAt
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
        price
      }
      toSubscription {
        id
      }
    }
  }
}`;
}

@Injectable({providedIn: 'root'})
export class TariffGQL extends Query<{ tariff }> {
  document = gql`
query ($id: ID!) {
  tariff(id: $id) {
    title
    teaser
    icon
    price
    features
    maxProjects
    maxProjectMembers
  }
}`;
}
