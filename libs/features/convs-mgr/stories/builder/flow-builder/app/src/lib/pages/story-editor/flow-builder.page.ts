import { Component, OnInit, OnDestroy, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { BuilderNavBarElementsProvider } from '@app/features/convs-mgr/stories/builder/nav';
// import { WFlowService} from '@app/state/convs-mgr/wflows';

import { SubSink } from 'subsink';



@Component({
  selector: 'app-flow-builder-page',
  templateUrl: './flow-builder.page.html',
  styleUrls: ['./flow-builder.page.scss']
})
export class FlowBuilderPageComponent implements OnInit, AfterViewInit, OnDestroy 
{
  private _sbS = new SubSink();

  @ViewChild('navbar') navbar: TemplateRef<Element>;

  showPreview = true;

  constructor(private _navbar: BuilderNavBarElementsProvider,
              // private _flowServ: WFlowService
  ) 
  { }

  ngOnInit(): void {
    this.saveFlow()
  }

  ngAfterViewInit() {
    console.log('Loading navbar onto parent');
    console.log(this.navbar);
    // Set navbar onto parent
    this._navbar.setBuilderNavElements(this.navbar, this)
  }

  saveFlow(){
    // this._flowServ.saveWFlow()
  }

  ngOnDestroy(): void {
      console.log("destroyed")
  }
}
