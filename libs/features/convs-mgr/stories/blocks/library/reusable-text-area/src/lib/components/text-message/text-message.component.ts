import { AfterViewInit, Component, ElementRef, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-text-message',
  templateUrl: './text-message.component.html',
  styleUrls: ['./text-message.component.scss'],
})
export class TextMessageComponent implements AfterViewInit{
  @Input() formgroup: FormGroup;

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    this.setFocusOnInput();
  }
  private setFocusOnInput() {
      const inputElement = this.el.nativeElement.querySelector('textarea[name="message"]');
      if (inputElement) {
        inputElement.focus();
      }
  }
}
