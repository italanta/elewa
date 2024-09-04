import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatRole'
})

export class RolePipe implements PipeTransform {
    transform(role: string){
        return role.replace(/([a-z])([A-Z])/g, '$1 $2')
    }
}