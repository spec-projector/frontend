import { Injectable } from '@angular/core';
import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class UploadFigmaAssetGQL extends Mutation<{ response }> {
  document = gql`
mutation ($input: CreateProjectAssetInput!) {
  response: uploadFigmaAsset(input: $input) {
    frame: projectAsset {
      file {
        url
      }
    }
  }
}`;
}
