import { Component, Input, ChangeDetectorRef, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { Location } from '@angular/common';

// import { BreadCrumb } from './breadcrumb.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-sub-navbar',
  templateUrl: './sub-navbar.component.html',
  styleUrls: ['./sub-navbar.component.scss']
})
export class SubNavBarComponent implements AfterViewInit
{
  @Input() pageEl: any;

  isScrolled = false;
  // @Input() backButton: boolean;
  // @Input() breadcrumbs: BreadCrumb[];

  // @Input() bgColor: string;
  // @Input() color:   string;
  // @Input() nomarg:  boolean;

  constructor(private _location: Location,
              private _cd: ChangeDetectorRef)
  { }

  count = 0;

  ngAfterViewInit(): void
  {
    this.pageEl.addEventListener('scroll', () => {
      this.isScrolled = this.pageEl.scrollTop > 0;
      this._cd.detectChanges();
    });
  }

  goBack = () => this._location.back();

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
