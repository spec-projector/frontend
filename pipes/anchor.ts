import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'anchor'
})

export class AnchorPipe implements PipeTransform {
  transform(value: any): any {
    const anchors = value.match(/\{\{(\w+)\}\}/ig);
    if (!!anchors) {
      anchors.forEach(anchor => {
        const id = anchor.match(/\{{([^\}}]*)\}}/)[1];
        value = value.replace(anchor, `<a href="#${id}">${id}</a>`);
      });
    }

    return value;
  }
}
