import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Injector,
  Output,
  EventEmitter
} from "@angular/core";

import { ReteEditor } from "../editor/editor";

@Component({
  selector: 'convl-rete-editor-frame',
  templateUrl: './rete-editor-frame.component.html',
  styleUrls: ['./rete-editor-frame.component.scss'],
})
export class ReteEditorFrameComponent implements AfterViewInit {
  title = "story-editor";
  frame: ReteEditor;

  @Output() frameLoaded = new EventEmitter<ReteEditor>;

  constructor(private injector: Injector) {}

  @ViewChild("rete") container!: ElementRef;

  ngAfterViewInit(): void {
    const el = this.container.nativeElement;

    if (el) {
      this.initEditor(el);
    }
  }

  async initEditor(el: HTMLElement) {
    this.frame = new ReteEditor(el, this.injector);
    this.frameLoaded.emit(this.frame);
  }
}
