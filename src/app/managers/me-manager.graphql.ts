import { Injectable } from '@angular/core';
import { Query } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class MeManagerGQL extends Query<{me}> {
  document = gql`
    query MeManager {
      me {
        id
        name
        glAvatar
        roles
      }
    }`;
}
