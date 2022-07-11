import { Component, Input } from '@angular/core';

@Component({
  selector:    'app-spinner',
  templateUrl: './spinner.component.html',
  styles: [ ]
})
export class SpinnerComponent { 
  
  @Input() diameter = 50;

}
