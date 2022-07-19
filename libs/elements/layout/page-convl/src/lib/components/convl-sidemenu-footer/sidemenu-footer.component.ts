import { Component, Input, OnInit } from '@angular/core';
import { User } from '@iote/bricks';

@Component({
  selector: 'convl-sidemenu-footer',
  templateUrl: './sidemenu-footer.component.html',
  styleUrls: [ './sidemenu-footer.component.scss' ]
})
export class SideMenuFooterComponent 
{
  @Input() user: User;

  lang : string;

}
