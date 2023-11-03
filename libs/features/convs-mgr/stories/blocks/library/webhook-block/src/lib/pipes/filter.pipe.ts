import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value:string[], filterString:string) {
    if (value.length == 0 || filterString == '') return value;

    return value.filter(variables =>
      variables.toLowerCase().includes(filterString.toLowerCase())
    );
  }

}
