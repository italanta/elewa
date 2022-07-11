import { Component, Input } from '@angular/core';

@Component({
  selector: 'iote-info-panel',
  templateUrl: './info-panel.component.html',
  styleUrls: ['./info-panel.component.scss']
})
export class InfoPanelComponent
{
  @Input() imageSrc: string;

  @Input() title: string;
  @Input() subTitle: string;
  @Input() txtColor: string = 'white';
  @Input() bgColor: string;

  constructor() { }
}
