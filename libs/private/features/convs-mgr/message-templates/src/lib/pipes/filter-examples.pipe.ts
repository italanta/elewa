import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterExamples',
    pure: false
})
export class FilterExamplesPipe implements PipeTransform {
    transform(items: any[], filter: string): any {
        if (items.length < 1 || !filter) {
            return items;
        }
        // filter the form array based on the section
        return items.filter(item => item.controls['section'].value.toString() == filter);
    }
}
