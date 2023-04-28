import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

import { Story } from '@app/model/convs-mgr/stories/main';

import { NewStoryService } from '../../services/new-story.service';
import { MatChipInputEvent } from '@angular/material/chips';

export interface Label {
  name:string;
  color:string;
  desc:string;
}

@Component({
  selector: 'convl-italanta-apps-create-bot-modal',
  templateUrl: './create-bot-modal.component.html',
  styleUrls: ['./create-bot-modal.component.scss'],
})
export class CreateBotModalComponent implements OnInit {

  botForm: FormGroup;
  modalMode: boolean;
  story: Story;
  imagePath: string;
  defaultImage: string = "assets/images/lib/block-builder/image-block-placeholder.jpg";

  storyImageFile: File;
  fileName: string;
  fileSizeIsValid: boolean = true;
  storyHasImage: boolean = false;

  isSavingStory: boolean = false;

  // These are label adds
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  // Handle all label logic
  labels:Label[] = [{name:'Farming',color:'red',desc:"this is a test run"}];
  addLabel(event: MatChipInputEvent): void{
    const value = (event.value || '').trim();

    // add label
    if(value){
      this.labels.push({name:value,color:value,desc:value});
    }
    event.chipInput?.clear();
  }

  remove(labels:Label):void {
    const index = this.labels.indexOf(labels);

    if(index >= 0){
      this.labels.splice(index,1)
    }
  }

  // END

  constructor(private _addStory$: NewStoryService,
              private _formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: {
                        isEditMode: boolean,
                        story?: Story
  }
  ) {
    this.modalMode = data.isEditMode;
    this.story = data.story as Story;
  }

  ngOnInit(): void {
    this.createFormGroup();

    if (this.modalMode) {
      this.updateFormGroup();
    }
  }

  createFormGroup() {
    this.botForm = this._formBuilder.group({
      botName: [this._addStory$.generateName()],
      botDesc: [''],
      botImage: ['']
    });
  }

  updateFormGroup() {
    this.botForm.patchValue({
      botName: this.story.name,
      botDesc: this.story.description,
      botImage: this.story.imageField
    });

    if (this.story.imageField && this.story.imageField != '') {
      this.storyHasImage = true;
      this.fileName = this.getFileNameFromFbUrl(this.story.imageField)
    }
  }

  add() {
    const bot: Story = {
      name: this.botForm.value.botName,
      description: this.botForm.value.botDesc,
      orgId: ''
    }

    if (this.storyHasImage) {
      this._addStory$.saveStoryWithImage(bot, this.storyImageFile, this.imagePath);
    }
    else {
      this._addStory$.saveImagelessStory(bot);
    }
  }

  update() {
    // Capture changes to bot name and bot description
    this.story.name = this.botForm.value.botName;
    this.story.description = this.botForm.value.botDesc;
    this.story.imageField = this.botForm.value.botImage ?? '';

    // Update bot details
    this._addStory$.update(this.story, this.storyImageFile, this.imagePath!);
  }

  imageChanged(event: any) {
    if (event.target.files[0]) {
      let image: File = event.target.files[0];
      if (this.validateFileSize(image)) {
        this.storyImageFile = image;
        this.imagePath = `images/${this.storyImageFile.name}`;
        this.fileName = this.storyImageFile.name;
        this.storyHasImage = true;
        this.fileSizeIsValid = true;
      }
      else {
        this.fileSizeIsValid = false;
      }
    }
  }

  getFileNameFromFbUrl(fbUrl: string): string {
    return fbUrl.split('%2F')[1].split("?")[0];
  }

  validateFileSize(file: File): boolean {
    return file.size <= 1000000;
  }

  submitForm() {
    this.isSavingStory = true;
    this.modalMode ? this.update() : this.add();
  }
}
