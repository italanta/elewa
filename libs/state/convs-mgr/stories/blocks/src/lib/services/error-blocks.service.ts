import { Injectable } from '@angular/core';
import { BlockError } from '@app/model/convs-mgr/stories/blocks/scenario';

import { BehaviorSubject, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorBlocksService {

  private errorBlock$$ = new BehaviorSubject<BlockError>({isError: false});

  private errorBlock$ = this.errorBlock$$.asObservable();

  setErrorBlock(error: BlockError){
    this.errorBlock$$.next(error);
    setTimeout(() => {
      this.errorBlock$$.next({isError: false})
    }, 5000);
  }

  getErrorBlock(){
    return this.errorBlock$.pipe(shareReplay())
  }
}
