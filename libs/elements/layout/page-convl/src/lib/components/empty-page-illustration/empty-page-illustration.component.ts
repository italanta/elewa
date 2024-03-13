import { Component, Input } from '@angular/core';

@Component({
  selector: 'convl-empty-page-illustration',
  templateUrl: './empty-page-illustration.component.html',
  styleUrls: ['./empty-page-illustration.component.scss'],
})
export class EmptyPageIllustrationComponent {
  @Input() text: string;
}
