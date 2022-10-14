import { Component, ElementRef,  HostListener, Input, OnInit} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { Logger } from '@iote/bricks-angular';

import { StoryBlock, StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';

import { _CreateImageMessageBlockForm } from '../../model/image-block-form.model';
import { _CreateLocationBlockForm } from '../../model/location-block-form.model';
import { _CreateQuestionBlockMessageForm } from '../../model/questions-block-form.model';
import { _CreateTextMessageBlockForm } from '../../model/message-block-form.model';
import { _CreateNameMessageBlockForm } from '../../model/name-block-form.model';
import { _CreateEmailMessageBlockForm } from '../../model/email-block-form.model';
import { _CreatePhoneMessageBlockForm } from '../../model/phonenumber-block-form.model';

import { StoryEditorState, StoryEditorStateService } from '@app/state/convs-mgr/story-editor';
import { throttleTime } from 'rxjs';
import * as _ from 'lodash';

import { _CreateDocumentMessageBlockForm } from '../../model/document-block-form.model';

/**
 * Block which sends a message from bot to user.
 */
@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss']
})
export class BlockComponent implements OnInit {
  @Input() id: string;
  @Input() block: StoryBlock;
  @Input() blocksGroup: FormArray;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  state: StoryEditorState;
  
  

  type: StoryBlockTypes;
  messagetype = StoryBlockTypes.TextMessage;
  imagetype = StoryBlockTypes.Image;
  nametype = StoryBlockTypes.Name;
  emailtype = StoryBlockTypes.Email;
  phonetype = StoryBlockTypes.PhoneNumber;
  questiontype = StoryBlockTypes.QuestionBlock;
  locationtype = StoryBlockTypes.Location;
  documentType = StoryBlockTypes.Document;

  blockFormGroup: FormGroup;

  constructor(
    private _editorStateService: StoryEditorStateService,
    private _el: ElementRef,
    private _fb: FormBuilder,
    private _logger: Logger) { }

  ngOnInit(): void {
    this.type = this.block.type;
   

    switch (this.type) {
      case StoryBlockTypes.TextMessage:
        this.blockFormGroup = _CreateTextMessageBlockForm(this._fb, this.block);
        this.blocksGroup.push(this.blockFormGroup);
        console.log(this.blocksGroup);
        
        break;

      case StoryBlockTypes.Image:
        this.blockFormGroup = _CreateImageMessageBlockForm(this._fb, this.block);
        this.blocksGroup.push(this.blockFormGroup);
        break;

      case StoryBlockTypes.Name:
        this.blockFormGroup = _CreateNameMessageBlockForm(this._fb, this.block);
        this.blocksGroup.push(this.blockFormGroup);
        break;

      case StoryBlockTypes.Email:
        this.blockFormGroup = _CreateEmailMessageBlockForm(this._fb, this.block);
        this.blocksGroup.push(this.blockFormGroup);
        break;

      case StoryBlockTypes.PhoneNumber:
        this.blockFormGroup = _CreatePhoneMessageBlockForm(this._fb, this.block);
        this.blocksGroup.push(this.blockFormGroup);
        break;
      case StoryBlockTypes.QuestionBlock:
        this.blockFormGroup = _CreateQuestionBlockMessageForm(this._fb, this.block);
        this.blocksGroup.push(this.blockFormGroup);
        break;

      case StoryBlockTypes.Location:
        this.blockFormGroup = _CreateLocationBlockForm(this._fb, this.block);
        this.blocksGroup.push(this.blockFormGroup);
        break;
      case StoryBlockTypes.Document:
        this.blockFormGroup = _CreateDocumentMessageBlockForm(this._fb, this.block);
        this.blocksGroup.push(this.blockFormGroup);
        break;

      default:
        break;
    }

  }

  /** 
   * Track and update coordinates of block and update them in data model.
   */
  @HostListener('mouseout', ['$event']) // Mouseout always happens after the drag (though it also hapens a lot more but not enough for perf issues)
  onDragEnd() {
    const style = this._el.nativeElement.getAttribute('style');

    const left = this._getPosFromStyle(style, 'left');
    const top = this._getPosFromStyle(style, 'top');

    // Update block data model (for saving and loading)
    this.block.position = {
      x: left ? left : this.block.position.x,
      y: top ? top : this.block.position.y
    };

    this.blockFormGroup.value.position = this.block.position;
  }

  /** 
   * Fn which gets the block position from the style element. 
   * jsPlumb sets the element position on the attribute style param during drag. */
  private _getPosFromStyle(style: string, pos: 'left' | 'top'): number | false {
    const idx = style.indexOf(pos);
    if (idx >= 0) {
      const start = idx + pos.length + 2; // Start position of the number we want to read is +2 since normal str is e.g. 'left: ' so left = pos.lenght and +2 = ': '
      const end = style.indexOf('px', start);

      const posStr = style.substring(start, end);
      const val = parseInt(posStr);

      return !isNaN(val) ? val : false;
    }
    return false;
  }
 

   deleteBlock(event: any)  {
    this._editorStateService._deleteBlock(event)
    this.blocksGroup.removeAt(this.blocksGroup.value.findIndex((block: { id: string; })  => block.id === block.id))
    this._editorStateService.get().subscribe((state=> (state))
    )
    
    
    
      }
    
   
 

 }

