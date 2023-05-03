import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { StoryBlockTypes } from "@app/model/convs-mgr/stories/blocks/main"

import { QuestionMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

/**
 * 
 * @param _fb instance of formbuilder that creates formgroups controls etc
 * @param blockData the data being patched into the FormGroup
 * @returns builds the formgroup with data if available and returns the Formgroup
 */
 export function _CreateQuestionBlockMessageForm(_fb: FormBuilder, blockData: QuestionMessageBlock): FormGroup
  {
    return _fb.group({
      id: [blockData?.id! ?? ''],
      message: [blockData?.message! ?? ''],
      defaultTarget: [blockData.defaultTarget ?? ''],
      options: _fb.array([]),
      type: [blockData.type ?? StoryBlockTypes.QuestionBlock],
      position: [blockData.position ?? { x: 200, y: 50 }],

      variable: _fb.group({
        name: [blockData.variable?.name ?? '', [Validators.required]],
        
      })
    })
  }