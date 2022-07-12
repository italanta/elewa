import { Component, Input, OnInit } from '@angular/core';
import { User } from '@iote/bricks';

@Component({
  selector: 'app-sidemenu-footer',
  templateUrl: './sidemenu-footer.component.html',
  styleUrls: [ './sidemenu-footer.component.scss' ]
})
export class SideMenuFooterComponent implements OnInit
{
  @Input() user: User;

  lang : string;

  constructor() {}

  ngOnInit() {  }

}
