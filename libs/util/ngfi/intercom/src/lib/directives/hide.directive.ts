import { Directive, HostListener, Input } from '@angular/core'

import { Intercom } from '../intercom/intercom'

@Directive({
  selector: '[libIntercomHide]'
})
export class IntercomHideDirective {
  @Input() intercomHide: boolean

  constructor(
    private intercom: Intercom
  ) { }

  @HostListener('click')
  public onClick(): void {
    if (this.intercomHide !== false) {
        this.intercom.hide()
    }
  }
}
