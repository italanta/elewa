import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'money'
})
export class MoneyPipe implements PipeTransform
{
  transform(money: number): string
  {
    return Math.round(money).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}
