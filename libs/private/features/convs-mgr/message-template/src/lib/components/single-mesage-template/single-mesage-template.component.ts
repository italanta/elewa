import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-single-mesage-template',
  templateUrl: './single-mesage-template.component.html',
  styleUrls: ['./single-mesage-template.component.scss'],
})
export class SingleMesageTemplateComponent {
  constructor(private _router: Router){}
  goToMessaging(){
    this._router.navigate(['/messaging'])
  }
}
