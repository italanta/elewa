import { Component, OnInit, Input } from '@angular/core';

import { Logger } from '../../../util/services/logger.service';

@Component({
  selector:    'app-frame',
  templateUrl: './frame.component.html'
})
/**
 * Frames are mainly used for theming within a screen,
 * A frame is a part of a window that can load separatly or can initiate separate styles for its child components.
 *
 * Example use: Root theming
 * Example use: Part of the blocks library, to give cards of other subjects a different look and feel than
 *                the rest of the page.
 */
export class FrameComponent implements OnInit {

  // @Input() loading = false; -- Can be used to load external frames
  @Input() slug: string;
  @Input() theme: string;

  constructor(private _logger: Logger)
  {}

  getTheme() {
    if(this.theme)
      return this.theme;
    else if(this.slug)
      return this.slug + '-theme';
    else
      return '';
  }

  ngOnInit() {
    if(!this.slug && !this.theme) // Not necessarely a problem, e.g. normal blocks.
      this._logger.debug(() => "Frame initialised without theme.");

    this._logger.debug(() => "Frame initialised. Loading components.");
  }
}
