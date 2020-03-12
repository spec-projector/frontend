import { Injectable } from '@angular/core';
import { Query } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
    providedIn: 'root'
})
export class IssueGQL extends Query<{ issue }> {
    document = gql`
    query ($url: String!, $token: String!, $system: System!) {
      issue(url: $url, token: $token, system: $system) {
        state
        assignee {
          name
          avatar
        }
        spent
        dueDate
        title
      }
    }`;
}
