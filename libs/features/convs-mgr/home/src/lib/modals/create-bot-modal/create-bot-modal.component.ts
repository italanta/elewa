
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NewStoryService } from '../../services/new-story.service';
import { UploadFileService } from '@app/state/file';


@Component({
  selector: 'convl-italanta-apps-create-bot-modal',
  templateUrl: './create-bot-modal.component.html',
  styleUrls: ['./create-bot-modal.component.scss'],
})
export class CreateBotModalComponent implements OnInit {
  botForm: FormGroup;

  isImage=false;
  constructor(private _addStory$: NewStoryService, private _formBuilder: FormBuilder, private _addImage$:UploadFileService) {}

  createFormGroup(){
    this.botForm = this._formBuilder.group({
      botName: [this._addStory$.generateName()],
      botDesc: ['']
    });
  }

  getUrl(file:any){

    if(file.target.files[0]){
      this.isImage=true;
    }
  }


  ngOnInit(): void {
    this.createFormGroup();
  }

  add = () => this._addStory$.add(this.botForm.value.botName as string,this.botForm.value.botDesc as string || '').subscribe();
}
