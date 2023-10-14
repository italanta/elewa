import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value:string[], filterString:string) {
    if (value.length == 0 || filterString == '') return value;

    const variables = []
    for (const variable of value){
      if (variable.toLowerCase().includes(filterString.toLowerCase())){
        variables.push(variable);
      }
    }
    return variables;
  }

}
