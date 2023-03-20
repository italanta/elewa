import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-message-block-edit',
  templateUrl: './message-block-edit.component.html',
  styleUrls: ['./message-block-edit.component.scss'],
})
export class MessageBlockEditComponent {
  @Input() form: FormGroup;
  public Editor:any = ClassicEditor;
  config: any = {
    toolbar: {
      items:[ 'heading', '|', 'Undo', 'Redo', '|', 'Bold', 'Italic', 'Underline', 'numberedList' , 'bulletedList','|', 'link' ],
      shouldNotGroupWhenFull: false
    },
    language: 'en'
  };

}
