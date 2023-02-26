import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidemenuToggleService {
  // expand: BehaviorSubject<boolean>;
  expand = new BehaviorSubject(true);

}
