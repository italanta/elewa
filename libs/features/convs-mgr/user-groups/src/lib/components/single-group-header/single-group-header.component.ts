import { Component, Input } from '@angular/core';

import { Classroom } from '@app/model/convs-mgr/classroom';
import { Router } from '@angular/router';

@Component({
  selector: 'app-single-group-header',
  templateUrl: './single-group-header.component.html',
  styleUrls: ['./single-group-header.component.scss'],
})
export class SingleGroupHeaderComponent {  
  @Input() classroom: Classroom;

  constructor(private _router: Router) { }

  goBack() 
  {
    this._router.navigate(['/user-groups'])
  }
}
