import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-message-template-single',
  templateUrl: './message-template-single.component.html',
  styleUrls: ['./message-template-single.component.scss'],
})
export class MessageTemplateSingleComponent {
  constructor(private _router: Router){}
  goToMessaging(){
    this._router.navigate(['/messaging'])
  }
}
