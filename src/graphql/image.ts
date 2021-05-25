import { Injectable } from '@angular/core';
import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class UploadImageGQL extends Mutation<{ response }> {
  document = gql`
mutation ($input: UploadImageInput!) {
  response: uploadImage(input: $input) {
    image {
      id
      url
    }
  }
}`;
}
