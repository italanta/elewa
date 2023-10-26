import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-message-template-header',
  templateUrl: './message-template-header.component.html',
  styleUrls: ['./message-template-header.component.scss'],
})
export class MessageTemplateHeaderComponent {
  constructor(private _router: Router){}
  goToHelp(){
    this._router.navigate(['/messaging/help'])
  }
}
