import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { OpenEndedQuestionBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

@Component({
  selector: 'app-open-ended-question-block',
  templateUrl: './open-ended-question-block.component.html',
  styleUrls: ['./open-ended-question-block.component.scss'],
})
export class OpenEndedQuestionBlockComponent {
  @Input() id: string;
  @Input() block: OpenEndedQuestionBlock;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  @Input() openEndedQuestionForm: FormGroup;

}
