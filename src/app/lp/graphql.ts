import { Injectable } from '@angular/core';
import { Mutation, Query } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class TariffsGQL extends Query<{ tariffs }> {
  document = gql`
{
  tariffs: allTariffs {
    count
    edges {
      node {
        id
        title
        teaser
        icon
        price
        features
        maxProjects
        maxProjectMembers
      }
    }
  }
}`;
}
