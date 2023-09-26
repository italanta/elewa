import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-message-template-view',
  templateUrl: './message-template-view.component.html',
  styleUrls: ['./message-template-view.component.scss'],
})
export class MessageTemplateViewComponent {
  constructor(private _router: Router){}
  goToMessaging(){
    this._router.navigate(['/messaging'])
  }
}
