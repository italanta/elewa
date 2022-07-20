import { Component, ElementRef, HostBinding, HostListener, Input, OnInit } from '@angular/core';

import { Logger } from '@iote/bricks-angular';
import { StoryBlock, StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';

/**
 * Block which sends a message from bot to user.
 */
@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss']
})
export class BlockComponent implements OnInit
{
  @Input() id: string;
  @Input() block: StoryBlock;

  type: StoryBlockTypes;
  messagetype = StoryBlockTypes.TextMessage;

  constructor(private _el: ElementRef,
              private _logger: Logger) 
  { }
  
  ngOnInit(): void {
    this.type = this.block.type;
  }

  /** 
   * Track and update coordinates of block and update them in data model.
   */
  @HostListener('mouseout', ['$event']) // Mouseout always happens after the drag (though it also hapens a lot more but not enough for perf issues)
  onDragEnd() 
  {
    const style = this._el.nativeElement.getAttribute('style');

    const left = this._getPosFromStyle(style, 'left');
    const top  = this._getPosFromStyle(style, 'top');

    this.block.position = {
      x: left ? left : this.block.position.x,
      y: top  ? top  : this.block.position.y
    };
  }

  /** 
   * Fn which gets the block position from the style element. 
   * jsPlumb sets the element position on the attribute style param during drag. */
  private _getPosFromStyle(style: string, pos: 'left' | 'top') : number | false
  {
    const idx = style.indexOf(pos);
    if(idx >= 0) {
      const start = idx + pos.length + 2; // Start position of the number we want to read is +2 since normal str is e.g. 'left: ' so left = pos.lenght and +2 = ': '
      const end = style.indexOf('px', start);        
      
      const posStr = style.substring(start, end);
      const val = parseInt(posStr);

      return !isNaN(val) ? val : false;
    }
    return false;
  }
}
