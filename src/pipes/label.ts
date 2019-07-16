import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'label'
})

export class LabelPipe implements PipeTransform {
    transform(value: any): any {
        const labels = value.match(/\[(\w+)]/ig);
        if (!!labels) {
            labels.forEach(label => {
                const id = label.match(/\[([^\]]*)]/)[1];
                value = value.replace(label, `<jnt-label label="{{${id}}}"></jnt-label>`);
            });
        }

        console.log(value);
        return value + ' ';
    }
}
