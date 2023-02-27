import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidemenuToggleService {
  private expand = new BehaviorSubject(true);
  observable$ = this.expand.asObservable();

  toggleExpand(value: boolean) {
    this.expand.next(value);
  }
}
