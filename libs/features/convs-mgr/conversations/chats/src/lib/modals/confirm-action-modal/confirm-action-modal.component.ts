import {Component, Inject, OnDestroy } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { take } from 'rxjs';
import { SubSink } from 'subsink';
import { Logger, ToastService } from '@iote/bricks-angular';
import { BackendService } from '@ngfi/angular';

import { ChatsStore } from '@app/state/convs-mgr/conversations/chats';


@Component({
  selector: 'app-move-to-section-modal',
  styleUrls: ['confirm-action-modal.component.scss'],
  templateUrl: 'confirm-action-modal.component.html',
})
export class ConfirmActionModal implements OnDestroy
{
  private _sbs = new SubSink()
  isLoaded = false;
  resume = false;
  
  constructor(private _chats$: ChatsStore,
              private _backendService: BackendService,
              private _dialogRef: MatDialogRef<ConfirmActionModal>,
              private _toastService: ToastService,
              private _logger: Logger,
              @Inject(MAT_DIALOG_DATA) private _data: { req: { chatId: string, action: 'resume' }, 
                                                        action: 'talkToHuman' | 'assignChat' })
  {
    this.resume = this._data.action === 'assignChat';
  }

  confirm()
  {
    // from(this._backendService.callFunction(this._data.action, this._data.req)).subscribe();

    console.log(this._data);

    this._sbs.sink = this._chats$.pauseChat(this._data.req.chatId).pipe(take(1)).subscribe()
    
    this.exitModal();
    if(this.resume)
    {
      this._toastService.doSimpleToast('Resuming Chat...');   
    }
    else
    {
      this._toastService.doSimpleToast('Pausing Chat...');      
    }
  }

  exitModal = () => this._dialogRef.close();

  ngOnDestroy(): void {
    this._sbs.unsubscribe()
  }

}