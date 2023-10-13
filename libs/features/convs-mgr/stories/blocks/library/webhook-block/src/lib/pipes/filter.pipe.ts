import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value:any, filterString:string) {
    if (value.length == 0 || filterString == '') return value;

    const variables = []
    for (const repo of value){
      if (repo['name'].toLowerCase().includes(filterString.toLowerCase())){
        variables.push(repo);
      }
    }
    return variables;
  }

}
