import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

import { PortalData } from '../model/portal-data.model';

@Injectable({
  providedIn: 'root',
})
export class BlockPortalService {
  activePortal = new Subject<PortalData>();
  portal$ = this.activePortal.asObservable();

  constructor() {
    //
  }

  public sendFormGroup(form: FormGroup, title: string) {
    this.activePortal.next({ form, title });
  }
}
