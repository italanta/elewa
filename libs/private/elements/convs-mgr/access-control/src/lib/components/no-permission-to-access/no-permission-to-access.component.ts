import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-no-permission-to-access',
  templateUrl: './no-permission-to-access.component.html',
  styleUrls: ['./no-permission-to-access.component.scss'],
})
export class NoPermissionToAccessComponent {

  constructor(private router$$: Router) {}

  back() {
   this.router$$?.navigate(['/home']);
  }
}
