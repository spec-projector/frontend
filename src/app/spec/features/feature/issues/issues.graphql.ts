import { Injectable } from '@angular/core';
import { Query } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class IssueGQL extends Query<{ issue }> {
  document = gql`
query ($input: IssueInput!) {
  issue(input: $input) {
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
