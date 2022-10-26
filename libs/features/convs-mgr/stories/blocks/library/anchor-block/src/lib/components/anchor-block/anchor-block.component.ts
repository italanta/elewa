import { AfterViewInit, Component, Input, OnInit } from '@angular/core';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import{ ActiveStoryStore } from '@app/state/convs-mgr/stories';

import { _JsPlumbComponentDecorator } from '@app/features/convs-mgr/stories/blocks/library/block-options';

import { map } from 'rxjs';
import { Story } from '@app/model/convs-mgr/stories/main';

@Component({
  selector: 'app-anchor-block',
  templateUrl: './anchor-block.component.html',
  styleUrls: ['./anchor-block.component.scss'],
})
export class AnchorBlockComponent implements OnInit, AfterViewInit {

  @Input() id: string;
  @Input() jsPlumb: BrowserJsPlumbInstance;
  anchorInput: string;


  constructor(private _story$$: ActiveStoryStore) { }

  ngOnInit(): void { 
    //get id of the story every time it initializes
    //The anchor block does not exist in the db, hence why we set this upon initialization of component
    this.getId().subscribe();
  }

  ngAfterViewInit(): void {
    //decorate the anchor block with jsplumb for the first connection
    this._decorateInput();
  }

  //Get the id of the story and set the anchor id to the same as the story id
  getId(){
    //set the id for the anchor to be the same as the story id
    return this._story$$.get()
                        .pipe(
                          map((story:Story) => this.anchorInput = story.id!));
  }

  
  private _decorateInput() {
    //Step 1 - Get the id of the element to decorate with jsplumb
    let input = document.getElementById(this.anchorInput) as Element;
    if (this.jsPlumb) {
      //Step 2 - Call the jsplumb decorator function
      input = _JsPlumbComponentDecorator(input, this.jsPlumb);
    }
  }
}
