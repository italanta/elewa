import { Injectable } from "@angular/core";
import { Observable} from "rxjs";

import { __StoryToFlowFrame, _CreateScreen } from "../model/story-to-flow-frame.function";

import { WFlowService } from "@app/state/convs-mgr/wflows";
import { FlowStory } from "@app/model/convs-mgr/stories/flows";
import { FlowBuilderStateProvider } from "../state/flow-builder-state.provider";

@Injectable({
  providedIn: 'root'
})
export class FlowBuilderStateService
{
  constructor(private _flow$$: WFlowService) {}

  get() {
    return new FlowBuilderStateProvider(this._flow$$);
  }

}