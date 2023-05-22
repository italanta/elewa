import { AfterViewInit, Component, Input } from '@angular/core';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { _JsPlumbComponentDecorator } from '@app/features/convs-mgr/stories/blocks/library/block-options';

@Component({
  selector: 'app-anchor-block',
  templateUrl: './anchor-block.component.html',
  styleUrls: ['./anchor-block.component.scss'],
})

/**
 * When a user send the first message to out chatbot, we cannot really know the first block
 *  to send them since what is being saved is just blocks and connections.
 *
 * Therefore we need a block that will act as the first block in the story and help us save the
 *  connection to the first block.
 *
 * So the Anchor Block @Component {AnchorBlockComponent} is a static component that is automatically added to the story editor
 * @see {StoryEditorFrame} new story is created. It is the 'anchor' point to the rest of the story.
 *
 * We will just save the first connection whose id == 'anchorId'. In this way, we will be able to get the
 *  first connection and send it back to the end user.
 */
export class AnchorBlockComponent implements AfterViewInit {
  @Input() id: string;
  @Input() jsPlumb: BrowserJsPlumbInstance;
  @Input() anchorInput: string;

  ngAfterViewInit(): void {
    this._decorateInput();
  }

  private _decorateInput() {
    //Step 1 - Get the id of the element to decorate with jsplumb
    const input = document.getElementById(this.anchorInput) as Element;


    if (this.jsPlumb) {
      //Step 2 - Call the jsplumb decorator function
      _JsPlumbComponentDecorator(input, this.jsPlumb);
    }
  }
}
