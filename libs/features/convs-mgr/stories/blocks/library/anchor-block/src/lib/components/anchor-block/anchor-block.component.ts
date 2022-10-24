import { AfterViewInit, Component, Input, OnInit } from '@angular/core';


import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { Logger } from '@iote/bricks-angular';
import{ ActiveStoryStore } from '@app/state/convs-mgr/stories';

import { _JsPlumbComponentDecorator } from '@app/features/convs-mgr/stories/blocks/library/block-options';
import { getLocaleId } from '@angular/common';
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
    this.getId().subscribe();
  }

  ngAfterViewInit(): void {
    this._decorateInput();
  }

  getId(){
    //set the id for the anchor to be the same as the story id
    return this._story$$.get()
                        .pipe(
                          map((story:Story) => this.anchorInput = story.id!));
  }

  private _decorateInput() {
    let input = document.getElementById(this.anchorInput) as Element;
    if (this.jsPlumb) {
      input = _JsPlumbComponentDecorator(input, this.jsPlumb);
    }
  }
}
