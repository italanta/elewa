import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidemenuToggleService {
  expand = new BehaviorSubject(true);

  toggleExpand(value:boolean){
    this.expand.next(value)
  }
}
