import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NewStoryService } from '../../services/new-story.service';
import { UploadFileService } from '@app/state/file';
import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'convl-italanta-apps-create-bot-modal',
  templateUrl: './create-bot-modal.component.html',
  styleUrls: ['./create-bot-modal.component.scss'],
})
export class CreateBotModalComponent implements OnInit {
  botForm: FormGroup;
  fileName: any;
  block: StoryBlock;
  uploadProgress = false;

  constructor(
    private _addStory$: NewStoryService,
    private _formBuilder: FormBuilder,
    private _addImage$: UploadFileService,
    private http: HttpClient
  ) {}

  createFormGroup() {
    this.botForm = this._formBuilder.group({
      botName: [this._addStory$.generateName()],
      botDesc: [''],
      botImage: [this._addImage$.uploadFile],
    });
  }

  ngOnInit(): void {
    this.createFormGroup();
  }

  onChange(event: any) {
    const file:File = event.target.files[0];
    if (file){
      this.uploadProgress = true;
      this.fileName = file.name;
      const formData = new FormData();
      formData.append("thumbnail", file);
      const upload$ = this.http.post("api/thumbnail-upload", formData);
      upload$.subscribe();
    }

  }

  fileUpload() {
    this._addImage$
      .upload(this.fileName, this.block)
      .subscribe((event: any) => {
        this.uploadProgress = event;
      });
  }

  add = () =>
    this._addStory$
      .add(
        this.botForm.value.botName as string,
        (this.botForm.value.botDesc as string) ||
        'this.botForm.value.botImage as File'
      )
      .subscribe();
}
