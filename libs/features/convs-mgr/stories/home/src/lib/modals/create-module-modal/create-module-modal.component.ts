import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { SubSink } from 'subsink';
import { Observable, of, switchMap, take } from 'rxjs';

import { BotModulesStateService } from '@app/state/convs-mgr/modules';
import { BotsStateService } from '@app/state/convs-mgr/bots';

import { BotModule } from '@app/model/convs-mgr/bot-modules';
import { Bot, BotMutationEnum } from '@app/model/convs-mgr/bots';

import { CREATE_EMPTY_BOT_MODULE } from '../../providers/forms/bot-module-form.provider';

@Component({
  selector: 'italanta-apps-create-module-modal',
  templateUrl: './create-module-modal.component.html',
  styleUrls: ['./create-module-modal.component.scss'],
})
export class CreateModuleModalComponent implements OnInit, OnDestroy {
  private _sBs = new SubSink();

  @Output() nextStepEvent = new EventEmitter<void>();

  moduleForm: FormGroup;

  botModule: BotModule;
  isCreateMode: boolean;
  isSavingModule: boolean;

  bots$: Observable<Bot[]>;

  constructor(
    private _botModulesServ: BotModulesStateService,
    private _botsServ$: BotsStateService,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    public data: { botMode: BotMutationEnum; botModule?: BotModule }
  ) {
    this.isCreateMode = data.botMode === BotMutationEnum.CreateMode;
    this.data.botModule ? this.botModule = this.data.botModule : ''
  }

  ngOnInit() {
    this.createFormGroup();

    if (!this.isCreateMode) {
      this.updateFormGroup();
    }

    this.bots$ = this._botsServ$.getBots();
  }

  createFormGroup() {
    this.moduleForm = CREATE_EMPTY_BOT_MODULE(this._formBuilder);
  }

  updateFormGroup() {
    this.moduleForm.patchValue({
      id: this.botModule.id,
      moduleName: this.botModule.name,
      moduleDesc: this.botModule.description,
      parentBot: this.botModule.parentBot,
      stories: this.botModule.stories
    });
  }

  submitForm() {
    const botModule: BotModule = {
      id: this.moduleForm.value.id,
      name: this.moduleForm.value.moduleName,
      description: this.moduleForm.value.moduleDesc,
      stories: this.moduleForm.value.stories,
      parentBot : this.moduleForm.value.parentBot.id
    };

    this.saveModuleState(botModule, this.moduleForm.value.parentBot);
  }

  /** Save the module and add the module's id to parent Bot's module list */
  saveModuleState(botModule: BotModule, parentBot: Bot) {
    this.isSavingModule = true;
    this._sBs.sink = this._botModulesServ
      .createBotModules(botModule)
      .pipe(
        take(1),
        switchMap((createdBotModule) => {
          return this._botsServ$.getBotById(parentBot.id as string).pipe(
            take(1),
            switchMap((bot) => {
              if (bot) {
                bot.modules.push(createdBotModule.id as string);
                return this._botsServ$.updateBot(bot as Bot);
              }

              return of(null); // Handle the case where bot is null (should never happen);
            })
          );
        })
      )
      .subscribe(() => {
        this.isSavingModule = false
        this.nextStepEvent.emit();
      });
  }

  ngOnDestroy() {
    this._sBs.unsubscribe();
  }
}
