import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class BlockPortalService {
  activePortal = new Subject<FormGroup>();
  portal$ = this.activePortal.asObservable();

  constructor() {
    //
  }

  public sendFormGroup(form: FormGroup) {
    this.activePortal.next(form);
  }
}
