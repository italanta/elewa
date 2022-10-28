import { Component } from '@angular/core';
import { FormBuilder,  FormGroup } from '@angular/forms';

import { NewStoryService } from '../../services/new-story.service';

@Component({
  selector: 'convl-italanta-apps-edit-bot-modal',
  templateUrl: './edit-bot-modal.component.html',
  styleUrls: ['./edit-bot-modal.component.scss'],
})
export class EditBotModalComponent  {
  botForm: FormGroup;
  constructor(private _addStory$: NewStoryService, private _formBuilder: FormBuilder) {
    // this.story = Story ;
  }

}
