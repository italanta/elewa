import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'platform'
})
export class PlatformPipe implements PipeTransform {

    transform(type: string) {
        if(type === 'whatsapp') {
            return 'WhatsApp';
        }
        return this.capitalizeFirstLetter(type);
    }

    capitalizeFirstLetter(text: string) {
        return text.charAt(0).toUpperCase() + text.slice(1)
    }

}