import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { SubSink } from 'subsink';
import { switchMap, take } from 'rxjs';

import { Bot, BotMutationEnum } from '@app/model/convs-mgr/bots';
import { FileStorageService } from '@app/state/file';
import { BotsStateService } from '@app/state/convs-mgr/bots';
import { ActiveOrgStore } from '@app/private/state/organisation/main';

import { generateName } from '../../providers/generate-name';


@Component({
  selector: 'convl-italanta-apps-create-bot-modal',
  templateUrl: './create-bot-modal.component.html',
  styleUrls: ['./create-bot-modal.component.scss'],
})
export class CreateBotModalComponent implements OnInit, OnDestroy {
  private _sBs = new SubSink();

  botForm: FormGroup;
  modalMode: BotMutationEnum;
  bot: Bot;
  imagePath: string;
  defaultImage = 'assets/images/lib/block-builder/image-block-placeholder.jpg';

  botImageFile: File;
  fileName: string;
  fileSizeIsValid = true;
  storyHasImage = false;

  isSavingStory = false;

  constructor(
    private _botStateServ$: BotsStateService,
    private _activeOrg$$: ActiveOrgStore,
    private _botImageUploadServ$: FileStorageService,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { botMode: BotMutationEnum; bot?: Bot }
  ) {
    this.modalMode = data.botMode;
    this.bot = data.bot as Bot;
  }

  ngOnInit(): void {
    this.createFormGroup();

    if (this.modalMode === BotMutationEnum.EditMode) {
      this.updateFormGroup();
    }
  }

  createFormGroup() {
    this.botForm = this._formBuilder.group({
      botName: [generateName()],
      botDesc: [''],
      botImage: [''],
      modules: [[]],
    });
  }

  updateFormGroup() {
    this.botForm.patchValue({
      botName: this.bot.name,
      botDesc: this.bot.description,
      botImage: this.bot.imageField,
      modules: this.bot.modules
    });

    if (this.bot.imageField && this.bot.imageField != '') {
      this.storyHasImage = true;
      this.fileName = this.getFileNameFromFbUrl(this.bot.imageField);
    }
  }

  imageChanged(event: any) {
    if (event.target.files[0]) {
      const image: File = event.target.files[0];
      if (this.validateFileSize(image)) {
        this.botImageFile = image;
        this.fileName = this.botImageFile.name;
        this.storyHasImage = true;
        this.fileSizeIsValid = true;
      } else {
        this.fileSizeIsValid = false;
      }
    }
  }

  getFileNameFromFbUrl(fbUrl: string): string {
    return fbUrl.split('%2F')[1].split('?')[0];
  }

  validateFileSize(file: File): boolean {
    return file.size <= 1000000;
  }

  mutateBot() {
    const bot: Bot = {
      name: this.botForm.value.botName,
      description: this.botForm.value.botDesc,
      modules: this.botForm.value.modules,
      imageField: this.botForm.value.imageField ?? '',
      orgId: '',
    };

    if (this.botImageFile) {
      this.saveImage(bot);
    } else {
      this.addBotToDb(bot);
    }
  }

  async saveImage(bot: Bot) {
    const imgFilePath = `images/${this.botImageFile.name}`;

    //1. if editMode and previous image exists, delete previous image
    if (this.modalMode === BotMutationEnum.EditMode && bot.imageField) {
      this._botImageUploadServ$.deleteSingleFile(bot.imageField).subscribe(() => {
        bot.imageField = ''
      })
    }

    //2. upload new image
    const res = await this._botImageUploadServ$.uploadSingleFile(
      this.botImageFile,
      imgFilePath
    );

    //3. Patch image URL and perform bot mutation (save to Db)
    this._sBs.sink = res.pipe(take(1)).subscribe((url) => {
      bot.imageField = url;
      this.addBotToDb(bot);
    });
  }

  addBotToDb(bot: Bot) {
    this._sBs.sink = this._activeOrg$$.get().pipe(
      take(1),
      switchMap((org) => {
        bot.orgId = org.id as string;

        if (this.modalMode === BotMutationEnum.EditMode) {
          return this._botStateServ$.updateBot(bot);
        } else {
          return this._botStateServ$.createBot(bot);
        }
      })
    )
    .subscribe(() => {
      this.isSavingStory = false
      // move to next step
    });
  }

  submitForm() {
    this.isSavingStory = true;
    this.mutateBot()
  }

  ngOnDestroy(): void {
    this._sBs.unsubscribe();
  }
}
