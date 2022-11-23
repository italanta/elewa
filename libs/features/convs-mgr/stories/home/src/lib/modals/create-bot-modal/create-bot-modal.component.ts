import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Story } from '@app/model/convs-mgr/stories/main';

import { NewStoryService } from '../../services/new-story.service';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { DocumentChange } from '@firebase/firestore-types';
import { NavigationBehaviorOptions } from '@angular/router';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { UploadFileService } from '@app/state/file';


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
  hasImage: boolean = false;
  isImage=false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
                isEditMode: boolean,
                story ? : Story
              },
              private _addStory$: NewStoryService,
              private _formBuilder: FormBuilder,
              private storage: AngularFireStorage,
              private _imageuploader:UploadFileService
  ) {
    this.modalMode = data.isEditMode;
    this.story = data.story as Story;
  }


  getUrl(file:any){

    if(file.target.files[0]){
      this.isImage=true;
    }
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
      botDesc: ['']
    });
  }

  updateFormGroup() {
    this.botForm.patchValue({
      botName: this.story.name,
      botDesc: this.story.description,
      botImage: this.story.imageField
    });

    if(this.story.imageField){
      this.isImage=true;
    }
  }

  add () {
    const bot: Story = {
      name: this.botForm.value.botName,
      description: this.botForm.value.botDesc,
      orgId: ''
    }

    if (this.hasImage) {
      this._addStory$.saveStoryWithImage(bot, this.storyImageFile, this.imagePath);
    }
    // this._addStory$.add(bot).subscribe();
    else{
      this._addStory$.saveImagelessStory(bot);
    }
  }

  update() {
    // Capture changes to bot name and bot description
    this.story.name = this.botForm.value.botName;
    this.story.description = this.botForm.value.botDesc;
    this.story.imageField = this.botForm.value.botImage;

    // Update bot details
    this._addStory$.update(this.story, this.storyImageFile, this.imagePath!);
  }
  imageChanged(event: any){
    if (event.target.files[0]){
      let image: File = event.target.files[0];
      this.storyImageFile = image;
      this.imagePath = `images/${this.storyImageFile.name}`;
      this.hasImage = true;
      this.isImage=true;
    }
  }

  submitForm() {
    this.modalMode ? this.update() : this.add();
  }
}
