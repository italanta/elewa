import { Component, Input, OnInit } from '@angular/core';

import { Breadcrumb } from '@iote/bricks-angular';

// import { BreadCrumb } from './breadcrumb.interface';

@Component({
  selector: 'convl-sub-navbar',
  templateUrl: './sub-navbar.component.html',
  styleUrls: ['./sub-navbar.component.scss']
})
export class SubNavBarComponent implements OnInit
{
  @Input() pageEl: any;

  isScrolled = false;
  @Input() backButton: boolean;
  @Input() breadcrumbs: Breadcrumb[];

  ngOnInit() {
    console.log(this.breadcrumbs);
  }

  // @Input() bgColor: string;
  // @Input() color:   string;
  // @Input() nomarg:  boolean;

  goBack = () => history.back();
  goToCrumb = (crumb: Breadcrumb) => crumb.callback();

  // getStyles()
  // {
  //   // const styles = {};
  //   // if(this.bgColor)
  //   //   styles['background-color'] = this.bgColor;
  //   // if(this.color)
  //   //   styles['color'] = this.color;
  //   // if(this.nomarg)
  //   //                         // Keep a bit anyway to have the drop shadow of the menu
  //   //   styles['margin-bottom'] = '2px';

  //   return styles;
  // }

}
