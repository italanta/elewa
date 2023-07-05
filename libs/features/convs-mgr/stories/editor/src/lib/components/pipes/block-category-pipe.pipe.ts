import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'blockCategoryPipe'
})
export class BlockCategoryPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
