import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { SubSink } from 'subsink';

import { BotsStateService } from '@app/state/convs-mgr/bots';

import { Story } from '@app/model/convs-mgr/stories/main';
import { CREATE_BOT_MODULE_FORM } from './create-module-form';

/**
 * Modal to create a module.
 * 
 * Determines which type of module you wish to create and add to the story
 */
@Component({
  selector: 'app-create-module-modal',
  templateUrl: './create-module-modal.component.html',
  styleUrls: ['./create-module-modal.component.scss'],
})
export class CreateModuleModalComponent implements OnInit, OnDestroy 
{
  private _sBs = new SubSink();

  _form: FormGroup;

  constructor(
    private _botStateServ$: BotsStateService,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { parent: Story }
  ) 
  { }

  ngOnInit(): void {
    this._form = CREATE_BOT_MODULE_FORM(this._formBuilder);
  }



  // private createBot(bot:Bot) {
  //   return this._botStateServ$.createBot(bot).pipe(
  //     tap((bot) => this.nextStepEvent.emit(bot)) 
  //   );
  // }


  // submitForm() {
  //   this.isSavingStory = true;
  //   this.mutateBot();
  // }

  ngOnDestroy(): void {
    this._sBs.unsubscribe();
  }
}
