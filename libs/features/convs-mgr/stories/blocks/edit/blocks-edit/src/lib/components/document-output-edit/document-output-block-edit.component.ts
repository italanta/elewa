import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DocumentMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

@Component({
  selector: 'app-document-output-block-edit',
  templateUrl: './document-output-block-edit.component.html',
  styleUrl: './document-output-block-edit.component.scss',
})
export class DocumentOutputBlockEditComponent {
  @Input() id: string;
  @Input() block: DocumentMessageBlock;
  @Input() title: string;
  @Input() icon: string;
  @Input() form: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;
}
