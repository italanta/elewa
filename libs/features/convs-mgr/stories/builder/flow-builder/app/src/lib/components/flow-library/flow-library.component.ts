import { SubSink } from 'subsink';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FLOW_CONTROLS, FlowControl, GROUP_FLOW_CONTROL_GROUPS } from '@app/model/convs-mgr/stories/flows';
import { SideScreenToggleService } from '@app/features/convs-mgr/stories/builder/editor-state';
// import { FlowEditorStateProvider } from '@app/state/convs-mgr/wflows';

@Component({
  selector: 'app-flow-library',
  templateUrl: './flow-library.component.html',
  styleUrls: ['./flow-library.component.scss']
})
export class FlowLibraryComponent implements OnInit, OnDestroy 
{
  private _sbS = new SubSink();

  controls: FlowControl[] = FLOW_CONTROLS();
  groupedControls = GROUP_FLOW_CONTROL_GROUPS(this.controls);
  isSideScreenOpen: boolean;

  constructor(
    // private flowStateProvider: FlowEditorStateProvider,
    private sideScreen: SideScreenToggleService
  ) 
  {}

  ngOnInit(): void {
    this.sideScreen.sideScreen$.subscribe((isOpen) => {
      this.isSideScreenOpen = isOpen;
    })
  }

  toggleSidenav() {
    this.sideScreen.toggleSideScreen(!this.isSideScreenOpen)
  }

  ngOnDestroy(): void {
      this._sbS.unsubscribe();
  }
}
