import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-micro-apps-header',
  templateUrl: './micro-apps-header.component.html',
  styleUrls: ['./micro-apps-header.component.scss']
})
export class MicroAppsHeaderComponent {
  @Input() logoUrl: string;
  goomzaLogo = '/assets/icons/goomza-logo-white.png'
}
