import { TemplatePortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlockPortalService {
  private activePortal = new Subject<TemplatePortal>();
  readonly portal$ = this.activePortal.asObservable();

  // constructor() { }
  public setPortal(portal: TemplatePortal) {
    console.log(portal)
    this.activePortal.next(portal);
  }
}
