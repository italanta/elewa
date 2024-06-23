import { Directive, HostListener, Input, Output } from '@angular/core';

import { Subject } from 'rxjs';

@Directive({
  selector: '[convlPinchZoom]',
})
export class PinchZoomDirective
{
  //@Input() scaleFactor = 0.03;
  @Input() debounceTime = 100; // in ms
  @Output() pinch$: Subject<number> = new Subject<number>();


  @HostListener('wheel', ['$event'])
  onWheel($event: WheelEvent) {
    if (!$event.ctrlKey) return;
    $event.preventDefault();

    const scale = $event.deltaY // * this.scaleFactor;
    this.pinch$.next(scale);
  }

}
