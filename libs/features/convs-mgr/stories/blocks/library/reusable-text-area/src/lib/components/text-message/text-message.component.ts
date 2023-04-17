import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-text-message',
  templateUrl: './text-message.component.html',
  styleUrls: ['./text-message.component.scss'],
})
export class TextMessageComponent {
  @Input() formgroup: FormGroup;
  public editor: any = ClassicEditor;
  config = {
    toolbar: [
      'heading',
      '|',
      'Bold',
      'Italic',
      'Link',
      'bulletedlist',
      'numberedList',
      'undo',
      'redo',
    ],
    shouldNotGroupWhenFull:false
  };
  onReady(val: any) {
    val.focus();
  }
}
