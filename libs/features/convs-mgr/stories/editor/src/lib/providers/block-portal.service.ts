import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PortalData } from '../model/portal-data.model';

import { BehaviorSubject, Subject } from 'rxjs';

import { ComponentPortal } from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root',
})
export class BlockPortalService {
  activePortal = new Subject<PortalData>();
  portal$ = this.activePortal.asObservable();

  activeComponent = new BehaviorSubject<{component: ComponentPortal<any>, id: string}>(null as any);
  component$ = this.activeComponent.asObservable();

  isOpened = new BehaviorSubject<boolean>(false);
  isOpened$ = this.isOpened.asObservable();


  constructor() {
    //
  }

  public sendFormGroup(form: FormGroup, title: string, icon: string, id: string) {
    this.activePortal.next({ form, title, icon, id });
  }

  setActiveComponent(activeComponent: ComponentPortal<any>, id: string) {
    this.activeComponent.next({component: activeComponent, id});
  }

  setOpened(opened: boolean) {
    this.isOpened.next(opened);
  }

  detachComponent(blockId: string) {
    const portalComponent = this.activeComponent.getValue();

    // Detach the edit portal for the block
    if(portalComponent && portalComponent.component && portalComponent.id == blockId) {
      portalComponent.component.detach();
      // Close the portal and return to blocks library
      this.setOpened(false);    
    }
  }
}
