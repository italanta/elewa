import { Directive, HostListener, EventEmitter, Output, ElementRef } from '@angular/core';

@Directive({
  selector: '[ngfiScrollable]'
})
/** Detects scrollbar position - @see https://fireship.io/lessons/infinite-scroll-firestore-angular/ */
export class ScrollableDirective
{

  @Output() scrollPosition = new EventEmitter()

  constructor(public el: ElementRef) { }

  @HostListener('scroll', ['$event'])
  onScroll(event: any)
  {
    try {
      const top = event.target.scrollTop
      const height = this.el.nativeElement.scrollHeight
      const offset = this.el.nativeElement.offsetHeight

      // emit bottom event
      if (top > height - offset - 1) {
        this.scrollPosition.emit('bottom')
      }

      // emit top event
      if (top === 0) {
        this.scrollPosition.emit('top')
      }

    }
    catch (err) 
    {
      console.error(err);
    }
  }

}
