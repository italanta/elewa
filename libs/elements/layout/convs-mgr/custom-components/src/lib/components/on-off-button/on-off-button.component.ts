import { Component } from '@angular/core';

@Component({
  selector: 'app-on-off-button',
  templateUrl: './on-off-button.component.html',
  styleUrls: ['./on-off-button.component.scss']
})
export class OnOffButtonComponent {
  isOn = false;

  toggle() {
    this.isOn = !this.isOn;
  }
}
