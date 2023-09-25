import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-text-message',
  templateUrl: './text-message.component.html',
  styleUrls: ['./text-message.component.scss'],
})
export class TextMessageComponent implements OnInit{
  @Input() formgroup: FormGroup;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.setFocusOnInput();
  }
  private setFocusOnInput() {
    // Use a timeout to ensure that the element is available in the DOM
    setTimeout(() => {
      const inputElement = this.el.nativeElement.querySelector('textarea[name="message"]');
      if (inputElement) {
        inputElement.focus();
      }
    });
  }
}
